const request = require('request');
const debug = require('debug')('jolteon');

module.exports = {
	text: text
};

function text (sender, text, cb) {
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
			debug('Error sending message: ', error);
			cb(error);
		} else if (response.body.error) {
			debug('Error: ', response.body.error);
			cb(response.body.error);
		} else {
			cb(null, body);
		}
	});
}
