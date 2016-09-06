'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('sg-messenger');
const async = require('async');
const send = require('./send');
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
	async.eachSeries(messagingEvents, (event, cb) => {
		const sender = event.sender.id;
		if (event.message && event.message.text) {
			debug('Received message: %s', event.message.text);
			const text = event.message.text;
			send(sender, 'Text received, echo: ' + text.substring(0, 200), cb);
		} else {
			cb();
		}
	}, (err) => {
		if (err) {
			res.sendStatus(400);
		} else {
			res.sendStatus(200);
		}
	});
});

app.listen(process.env.PORT || 3000);
