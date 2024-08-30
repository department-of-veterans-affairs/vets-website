const inboxThreads = require('./inboxThreads.json');

const sendThreads = require('./sendThreads.json');

const draftThreads = require('./draftThreads.json');

const trashThreads = require('./trashThreads.json');

const customFolderThreads = require('./customFolderThreads.json');

const allThreads = {
  data: [
    ...inboxThreads.data,
    ...sendThreads.data,
    ...draftThreads.data,
    ...trashThreads.data,
    ...customFolderThreads.data,
  ],
};

const folders = {
  '0': inboxThreads,
  '-1': sendThreads,
  '-2': draftThreads,
  '-3': trashThreads,
  '123456': customFolderThreads,
};

const categoryCorrection = {
  appointment: 'APPOINTMENTS',
  covid: 'COVID',
  general: 'OTHER',
  medication: 'MEDICATIONS',
  test: 'TEST_RESULTS',
  education: 'EDUCATION',
};

const paginatedThreads = (req, res) => {
  const { index } = req.params;
  const { pageSize, pageNumber, sortField, sortOrder } = req.query;

  const sortFunc = (a, b) => {
    if (sortField === 'SENT_DATE') {
      if (sortOrder === 'DESC') {
        return b.attributes.sentDate.localeCompare(a.attributes.sentDate);
      }
      if (sortOrder === 'ASC') {
        return a.attributes.sentDate.localeCompare(b.attributes.sentDate);
      }
    } else if (sortField === 'DRAFT_DATE') {
      if (sortOrder === 'DESC') {
        return b.attributes.draftDate.localeCompare(a.attributes.draftDate);
      }
      if (sortOrder === 'ASC') {
        return a.attributes.draftDate.localeCompare(b.attributes.draftDate);
      }
    } else if (sortField === 'SENDER_NAME') {
      if (sortOrder === 'DESC') {
        return b.attributes.senderName.localeCompare(a.attributes.senderName);
      }
      if (sortOrder === 'ASC') {
        return a.attributes.senderName.localeCompare(b.attributes.senderName);
      }
    } else if (sortField === 'RECIPIENT_NAME') {
      if (sortOrder === 'DESC') {
        return b.attributes.recipientName.localeCompare(
          a.attributes.recipientName,
        );
      }
      if (sortOrder === 'ASC') {
        return a.attributes.recipientName.localeCompare(
          b.attributes.recipientName,
        );
      }
    }

    return 0;
  };

  if (index in folders) {
    return res.json({
      data: [
        ...folders[index].data
          .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
          .sort((a, b) => {
            return sortFunc(a, b);
          }),
      ],
    });
  }

  return res.json({ data: [] });
};

const searchThreads = (req, res) => {
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
                toDate.localeCompare(msg.attributes?.sentDate >= 0)
              : true),
        ),
      ],
    });
  }

  return res.json({ data: [] });
};

const thread = (req, res) => {
  const { id } = req.params;
  const message = allThreads.data.find(
    msg => msg.attributes.messageId === Number(id),
  );
  return res.json({
    data: [
      ...allThreads.data.filter(
        msg => msg?.attributes.threadId === message?.attributes.threadId,
      ),
    ],
  });
};

const singleMessage = (req, res) => {
  const { id } = req.params;
  return res.json(
    allThreads.data.find(msg => msg.attributes.messageId === Number(id)),
  );
};

const moveThread = (req, res) => {
  return res.status(204).json();
};

module.exports = {
  paginatedThreads,
  thread,
  singleMessage,
  moveThread,
  searchThreads,
};
