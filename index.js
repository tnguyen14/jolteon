'use strict';

const express = require('express');
const request = require('superagent');
const bodyParser = require('body-parser');

const pageToken = process.env.PAGE_TOKEN;
const verifyToken = process.env.VERIFY_TOKEN;

const app = express();
app.use(bodyParser.json());

app.get('/webhook/', (req, res) => {
	if (req.query['hub.verify_token'] === verifyToken) {
		return res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong validation token');
});

app.post('/webhook/', (req, res) => {
	const messagingEvents = req.body.entry[0].messaging;
	messagingEvents.forEach((event) => {
		const sender = event.sender.id;
		if (event.message && event.message.text) {
			const text = event.message.text;
			sendTextMessage(sender, 'Text received, echo: ' + text.substring(0, 200));
		}
	});
	res.sendStatus(200);
});

function sendTextMessage (sender, text) {
	request.post('https://graph.facebook.com/v2.6/me/messages')
		.set('Host', process.env.HOST || 'localhost')
		.query({access_token: pageToken})
		.send({
			recipient: {
				id: sender
			},
			message: {
				text: text
			}
		})
		.end((error, response, body) => {
			if (error) {
				console.log('Error sending message: ', error);
			} else if (response.body.error) {
				console.log('Error: ', response.body.error);
			}
		});
}

app.listen(process.env.PORT || 3000);
