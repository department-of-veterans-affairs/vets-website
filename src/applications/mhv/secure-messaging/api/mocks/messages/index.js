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
        readReceipt: 'READ',
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
        readReceipt: 'READ',
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
