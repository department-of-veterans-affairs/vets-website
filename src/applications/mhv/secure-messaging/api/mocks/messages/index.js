const thread = {
  data: [
    {
      id: '2711197',
      type: 'message_thread_details',
      attributes: {
        messageId: 2711197,
        category: 'TEST_RESULTS',
        subject: 'Test Inquiry',
        body: 'Ground control to major Tom',
        attachment: null,
        sentDate: '2023-03-20T18:38:54.000Z',
        senderId: 1835650,
        senderName: 'RATANA, NARIN ',
        recipientId: 523757,
        recipientName: 'FREEMAN, MELVIN  V',
        readReceipt: null,
        triageGroupName: 'VA Flagship mobile applications interface 1_DAYT29',
        proxySenderName: null,
        threadId: 2708575,
        folderId: 0,
        messageBody: 'Ground control to major Tom',
        draftDate: null,
        toDate: null,
        hasAttachments: false,
      },
      links: {
        self:
          'https://staging-api.va.gov/my_health/v1/messaging/messages/2711197',
      },
    },
    {
      id: '2708576',
      type: 'message_thread_details',
      attributes: {
        messageId: 2708576,
        category: 'TEST_RESULTS',
        subject: 'Test Inquiry',
        body:
          'The first time you have a chance at the top is the second one you get a free pass and you can go on your way back and then go to your car to pick it out of there so I don&rsquo;t have any money for that and I can get it back and you could get a ride ',
        attachment: null,
        sentDate: '2023-03-18T01:28:45.000Z',
        senderId: 523757,
        senderName: 'FREEMAN, MELVIN V',
        recipientId: 1766073,
        recipientName: 'VA Flagship mobile applications interface 1_DAYT29',
        readReceipt: null,
        triageGroupName: 'VA Flagship mobile applications interface 1_DAYT29',
        proxySenderName: null,
        threadId: 2708575,
        folderId: -1,
        messageBody:
          'The first time you have a chance at the top is the second one you get a free pass and you can go on your way back and then go to your car to pick it out of there so I don&rsquo;t have any money for that and I can get it back and you could get a ride ',
        draftDate: null,
        toDate: null,
        hasAttachments: false,
      },
      links: {
        self:
          'https://staging-api.va.gov/my_health/v1/messaging/messages/2708576',
      },
    },
    {
      id: '123456',
      type: 'message_thread_details',
      attributes: {
        messageId: 123456,
        category: 'TEST_RESULTS',
        subject: 'Bonsu: Test Inquiry',
        body:
          'BONUS ROUND! lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        attachment: null,
        sentDate: '2023-03-18T01:28:45.000Z',
        recipientName: 'FREEMAN, MELVIN V',
        recipientId: 523757,
        senderId: 1766073,
        senderName: 'VA Flagship mobile applications interface 1_DAYT29',
        readReceipt: 'READ',
        triageGroupName: 'VA Flagship mobile applications interface 1_DAYT29',
        proxySenderName: null,
        threadId: 2708575,
        folderId: -1,
        messageBody:
          'BONUS ROUND! lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        draftDate: null,
        toDate: null,
        hasAttachments: false,
      },
      links: {
        self:
          'https://staging-api.va.gov/my_health/v1/messaging/messages/2708576',
      },
    },
    {
      id: '9876543',
      type: 'message_thread_details',
      attributes: {
        messageId: 9876543,
        category: 'TEST_RESULTS',
        subject: 'Test Inquiry',
        body: ' This is my third messages',
        attachment: null,
        sentDate: '2023-03-18T01:28:45.000Z',
        senderId: 523757,
        senderName: 'FREEMAN, MELVIN V',
        recipientId: 1766073,
        recipientName: 'VA Flagship mobile applications interface 1_DAYT29',
        readReceipt: 'READ',
        triageGroupName: 'VA Flagship mobile applications interface 1_DAYT29',
        proxySenderName: null,
        threadId: 2708575,
        folderId: -1,
        messageBody: ' This is my third messages',
        draftDate: null,
        toDate: null,
        hasAttachments: false,
      },
      links: {
        self:
          'https://staging-api.va.gov/my_health/v1/messaging/messages/2708576',
      },
    },
  ],
};

const single = {
  data: {
    id: '2711197',
    type: 'messages',
    attributes: {
      messageId: 2711197,
      category: 'TEST_RESULTS',
      subject: 'Test Inquiry',
      body: 'Ground control to major Tom',
      attachment: false,
      sentDate: '2023-03-20T18:38:54.000Z',
      senderId: 1835650,
      senderName: 'RATANA, NARIN ',
      recipientId: 523757,
      recipientName: 'FREEMAN, MELVIN  V',
      readReceipt: 'READ',
      triageGroupName: 'VA Flagship mobile applications interface 1_DAYT29',
      proxySenderName: null,
    },
    relationships: { attachments: { data: [] } },
    links: {
      self:
        'https://staging-api.va.gov/my_health/v1/messaging/messages/2711197',
    },
  },
};
module.exports = {
  thread,
  single,
};
