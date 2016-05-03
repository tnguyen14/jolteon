const express = require('express');
const request = require('superagent');

const app = express();
const pageToken = process.env.PAGE_TOKEN;
const verifyToken = process.env.VERIFY_TOKEN;

app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === verifyToken) {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
	const messaging_events = req.body.entry[0].messaging;
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i];
		let sender = event.sender.id;
		if (event.message && event.message.text) {
			let text = event.message.text;
			sendTextMessage(sender, 'Text received, echo: ' + text.substring(0, 200));
		}
	}
	res.sendStatus(200);
});

function sendTextMessage (sender, text) {
	const messageData = {
		text: text
	};
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token: pageToken},
		method: 'POST',
		json: {
			recipient: {id: sender},
			message: messageData
		}
	}, function (error, response, body) {
		if (error) {
			console.log('Error sending message: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
}

app.listen(process.env.PORT || 3000);
