'use strict';

require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('jolteon');
const messagingEvent = require('./event');
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
	// make sure it is a page subscription
	if (req.body.object !== 'page') {
		debug('Error: Not a page subscription');
		return;
	}
	req.body.entry.forEach((pageEntry) => {
		// var pageID = pageEntry.id;
		// var timeOfEvent = pageEntry.time;

		// Handle messaging events
		pageEntry.messaging.forEach(messagingEvent);
	});

	// Assume all went well
	res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);
