const { compareDesc } = require('date-fns');
const { inboxMessages } = require('./inboxMessages');
const sentMessages = require('./sentMessages.json');
const draftMessages = require('./draftMessages.json');
const trashMessages = require('./trashMessages.json');
const customFolderMessages = require('./customFolderMessages.json');
const { messageDetails } = require('./messageDetails');

const allMessages = {
  data: [
    ...inboxMessages.data,
    ...sentMessages.data,
    ...draftMessages.data,
    ...trashMessages.data,
    ...customFolderMessages.data,
  ],
};

const folders = {
  '0': inboxMessages,
  '-1': sentMessages,
  '-2': draftMessages,
  '-3': trashMessages,
  '123456': customFolderMessages,
};

const categoryCorrection = {
  appointment: 'APPOINTMENTS',
  covid: 'COVID',
  general: 'OTHER',
  medication: 'MEDICATIONS',
  test: 'TEST_RESULTS',
  education: 'EDUCATION',
};

const singleThread = (req, res) => {
  const { id } = req.params;
  const message = messageDetails.data.find(
    msg => Number(msg?.attributes?.messageId) === Number(id),
  );
  const thread = {
    data: [
      ...messageDetails.data
        .filter(
          msg => msg?.attributes?.threadId === message?.attributes?.threadId,
        )
        .sort((a, b) =>
          compareDesc(
            new Date(a?.attributes?.sentDate),
            new Date(b?.attributes?.sentDate),
          ),
        ),
    ],
  };
  if (thread.data.length === 0) {
    return res.json({
      data: [message],
    });
  }
  return res.json(thread);
};

const singleMessage = (req, res) => {
  const { id } = req.params;
  return res.json(
    allMessages.data.find(msg => msg.attributes.messageId === Number(id)),
  );
};

const searchMessages = (req, res) => {
  const { index } = req.params;
  const { category, fromDate, toDate } = req.body;

  if (index in folders) {
    return res.json({
      data: [
        ...folders[index].data.filter(
          msg =>
            (category
              ? msg.attributes.category === categoryCorrection[category]
              : true) &&
            (fromDate && toDate
              ? fromDate.localeCompare(msg.attributes?.sentDate) <= 0 &&
                toDate.localeCompare(msg.attributes?.sentDate) >= 0
              : true),
        ),
      ],
    });
  }

  return res.json({ data: [] });
};

module.exports = {
  singleThread,
  singleMessage,
  searchMessages,
};
