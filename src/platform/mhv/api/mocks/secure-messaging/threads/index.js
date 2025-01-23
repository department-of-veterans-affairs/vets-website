const { compareAsc, compareDesc } = require('date-fns');
const { inboxThreads } = require('./inboxThreads');
const sendThreads = require('./sendThreads.json');
const draftThreads = require('./draftThreads.json');
const trashThreads = require('./trashThreads.json');
const customFolderThreads = require('./customFolderThreads.json');

const folders = {
  '0': inboxThreads,
  '-1': sendThreads,
  '-2': draftThreads,
  '-3': trashThreads,
  '123456': customFolderThreads,
};

const paginatedThreads = (req, res) => {
  const { index } = req.params;
  const { pageSize, pageNumber, sortField, sortOrder } = req.query;

  const sortFunc = (a, b) => {
    if (sortField === 'SENT_DATE') {
      if (sortOrder === 'DESC') {
        return compareDesc(
          new Date(a.attributes.sentDate),
          new Date(b.attributes.sentDate),
        );
      }
      if (sortOrder === 'ASC') {
        return compareAsc(
          new Date(a.attributes.sentDate),
          new Date(b.attributes.sentDate),
        );
      }
    } else if (sortField === 'DRAFT_DATE') {
      if (sortOrder === 'DESC') {
        return compareDesc(
          new Date(a.attributes.draftDate),
          new Date(b.attributes.draftDate),
        );
      }
      if (sortOrder === 'ASC') {
        return compareAsc(
          new Date(a.attributes.draftDate),
          new Date(b.attributes.draftDate),
        );
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
          .sort((a, b) => {
            return sortFunc(a, b);
          })
          .slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
      ],
    });
  }

  return res.json({ data: [] });
};

const moveThread = (req, res) => {
  return res.status(204).json();
};

module.exports = {
  paginatedThreads,
  moveThread,
};
