/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const folders = require('./folders');
const recipients = require('./recipients');
const categories = require('./categories');
const messages = require('./messages');

const responses = {
  'GET /my_health/v1/messaging/folders': folders.allFolders,
  'GET /my_health/v1/messaging/folders/:index': folders.oneFolder,
  'GET /my_health/v1/messaging/folders/:index/messages': folders.messages,
  'GET /my_health/v1/messaging/folders/0/threads': folders.allThreads,
  'GET /my_health/v1/messaging/messages/categories':
    categories.defaultCategories,
  'GET /my_health/v1/messaging/messages/:id': messages.single,
  'GET /my_health/v1/messaging/messages/:id/thread': messages.thread,
  'GET /my_health/v1/messaging/recipients': recipients.defaultRecipients,
};

module.exports = delay(responses, 3000);
