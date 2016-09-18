const request = require('request');

module.exports = function (sender, text, cb) {
	request({
		url: 'https://graph.facebook.com/v2.7/me/messages',
		method: 'POST',
		qs: {
			access_token: process.env.PAGE_TOKEN
		},
		json: {
			recipient: {
				id: sender
			},
			message: {
				text: text
			}
		}
	}, function (error, response, body) {
		if (error) {
			console.error('Error sending message: ', error);
			cb(error);
		} else if (response.body.error) {
			console.error('Error: ', response.body.error);
			cb(response.body.error);
		} else {
			cb(null, body);
		}
	});
};
