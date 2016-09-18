const debug = require('debug')('jolteon');
const send = require('./send');

module.exports = function (event) {
	if (event.message) {
		processMessage(event);
	} else if (event.postback) {

	} else {
		debug('Recived unknown messagingEvent: ', event);
	}
};

function processMessage (event) {
	const senderId = event.sender.id;
	const pageId = event.recipient.id;
	const timeOfMessage = event.timestamp;
	const message = event.message;

	debug('Received message for user %d and page %d at %d with message:',
		senderId, pageId, timeOfMessage);
	debug(JSON.stringify(message));

	const isEcho = message.is_echo;
	const messageId = message.mid;
	const appId = message.app_id;
	const metadata = message.metadata;

	// either a text or attachment but not both
	const text = message.text;
	const attachments = message.attachments;
	const quickReply = message.quick_reply;

	if (isEcho) {
		debug('Received echo for message %s and app %d with metadata %s',
			messageId, appId, metadata);
		return;
	}
	if (quickReply) {
		debug('Received quick reply for message %s with payload %s',
			messageId, quickReply.payload);
		return;
	}
	if (attachments) {
		debug('Received message %s with attachments', messageId);
		return;
	}
	if (text) {
		send.text(senderId, 'Text received, echo: ' + text, function () {});
	}
}
