const request = require('request');

module.exports = function (sender, text, cb) {
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
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
			console.log('Error sending message: ', error);
			cb(error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
			cb(response.body.error);
		} else {
			cb(null, body);
		}
	});
};
