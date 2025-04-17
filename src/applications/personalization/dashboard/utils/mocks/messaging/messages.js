import environment from '~/platform/utilities/environment';

export const mockMessagesResponse = {
  data: [
    {
      id: '1412070',
      type: 'messages',
      attributes: {
        messageId: 1412070,
        category: 'MEDICATIONS',
        subject: 'medication - question',
        body: null,
        attachment: false,
        sentDate: '2020-08-10T22:08:52.000Z',
        senderId: 388014,
        senderName: 'GAGANAPALLY, PRANEETH ',
        recipientId: 1170779,
        recipientName: 'GPSYSRXTESTONE, KRISTIE ',
        readReceipt: null,
      },
      links: {
        self: `${environment.API_URL}/my_health/v1/messaging/messages/1412070`,
      },
    },
    {
      id: '1412061',
      type: 'messages',
      attributes: {
        messageId: 1412061,
        category: 'EDUCATION',
        subject: 'test - draft',
        body: null,
        attachment: false,
        sentDate: '2020-08-10T22:07:37.000Z',
        senderId: 388014,
        senderName: 'GAGANAPALLY, PRANEETH ',
        recipientId: 1170779,
        recipientName: 'GPSYSRXTESTONE, KRISTIE ',
        readReceipt: null,
      },
      links: {
        self: `${environment.API_URL}/my_health/v1/messaging/messages/1412061`,
      },
    },
    {
      id: '1412052',
      type: 'messages',
      attributes: {
        messageId: 1412052,
        category: 'OTHER',
        subject: 'General question - 1',
        body: null,
        attachment: false,
        sentDate: '2020-08-10T22:07:17.000Z',
        senderId: 388014,
        senderName: 'GAGANAPALLY, PRANEETH ',
        recipientId: 1170779,
        recipientName: 'GPSYSRXTESTONE, KRISTIE ',
        readReceipt: null,
      },
      links: {
        self: `${environment.API_URL}/my_health/v1/messaging/messages/1412052`,
      },
    },
  ],
  links: {
    self: `${environment.API_URL}/my_health/v1/messaging/folders/0/messages?page=1&sort=-sent_date`,
    first: `${environment.API_URL}/my_health/v1/messaging/folders/0/messages?page=1&per_page=10&sort=-sent_date`,
    prev: null,
    next: null,
    last: `${environment.API_URL}/my_health/v1/messaging/folders/0/messages?page=1&per_page=10&sort=-sent_date`,
  },
  meta: {
    sort: { sentDate: 'DESC' },
    pagination: { currentPage: 1, perPage: 10, totalPages: 1, totalEntries: 3 },
  },
};
