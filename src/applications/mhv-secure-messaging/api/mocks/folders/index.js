/* eslint-disable camelcase */
const allFolders = {
  data: [
    {
      id: '0',
      type: 'folders',
      attributes: {
        folderId: 0,
        name: 'Inbox',
        count: 260,
        unreadCount: 22,
        systemFolder: true,
      },
      links: {
        self: 'https://staging-api.va.gov/my_health/v1/messaging/folders/0',
      },
    },
  ],
  links: {
    self:
      'https://staging-api.va.gov//my_health/v1/messaging/folders?page=1&per_page=999&use_cache=false',
    first:
      'https://staging-api.va.gov//my_health/v1/messaging/folders?page=1&per_page=100&use_cache=false',
    prev: null,
    next: null,
    last:
      'https://staging-api.va.gov//my_health/v1/messaging/folders?page=1&per_page=100&use_cache=false',
  },
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 100,
      totalPages: 1,
      totalEntries: 14,
    },
  },
};

const oneFolder = {
  data: {
    id: '0',
    type: 'folders',
    attributes: {
      folderId: 0,
      name: 'Inbox',
      count: 260,
      unreadCount: 68,
      systemFolder: true,
    },
    links: {
      self: 'https://staging-api.va.gov/my_health/v1/messaging/folders/0',
    },
  },
};
const messages = {
  data: [
    {
      id: '2711197',
      type: 'messages',
      attributes: {
        messageId: 2711197,
        category: 'TEST_RESULTS',
        subject: 'Test Inquiry',
        body: null,
        attachment: false,
        sentDate: '2023-03-20T18:38:54.000Z',
        senderId: 1835650,
        senderName: 'RATANA, NARIN ',
        recipientId: 523757,
        recipientName: 'FREEMAN, MELVIN  V',
        readReceipt: 'READ',
        triageGroupName: null,
        proxySenderName: null,
      },
      links: {
        self:
          'https://staging-api.va.gov/my_health/v1/messaging/messages/2711197',
      },
    },
  ],
  meta: { sort: { sentDate: 'DESC' } },
};

const allThreads = {
  data: [
    {
      id: '2708575',
      type: 'message_threads',
      attributes: {
        threadId: 2708575,
        folderId: 0,
        messageId: 2711197,
        threadPageSize: 166,
        messageCount: 2,
        category: 'TEST_RESULT',
        subject: 'Test Inquiry',
        triageGroupName: 'VA Flagship mobile applications interface 1_DAYT29',
        sentDate: '2023-03-20T18:38:54.000Z',
        draftDate: null,
        senderId: 1835650,
        senderName: 'RATANA, NARIN ',
        recipientName: 'FREEMAN, MELVIN  V',
        recipientId: 523757,
        proxySenderName: null,
        hasAttachment: false,
        unsentDrafts: false,
        unreadMessages: false,
      },
      links: {
        self:
          'https://staging-api.va.gov/my_health/v1/messaging/threads/2708575',
      },
    },
  ],
};

module.exports = {
  allFolders,
  oneFolder,
  messages,
  allThreads,
};
