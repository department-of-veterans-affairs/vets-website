export const messagesSuccess = {
  data: [
    {
      attributes: {
        attachment: true,
        body: null,
        category: 'MEDICATIONS',
        messageId: 123,
        readReceipt: 'READ',
        recipientId: 1,
        recipientName: 'Veteran',
        senderId: 2,
        senderName: 'Clinician',
        sentDate: '2016-12-21T05:54:26.000Z',
        subject: 'Prescription Request',
      },
      id: '123',
      links: {
        self: 'http://www.example.com/my_health/v1/messaging/messages/123',
      },
      type: 'messages',
    },

    {
      attributes: {
        attachment: true,
        body: null,
        category: 'APPOINTMENTS',
        messageId: 456,
        readReceipt: 'READ',
        recipientId: 1,
        recipientName: 'Veteran',
        senderId: 2,
        senderName: 'Clinician',
        sentDate: '2016-11-15T18:33:05.000Z',
        subject: 'Appointment Schedule',
      },
      id: '456',
      links: {
        self: 'http://www.example.com/my_health/v1/messaging/messages/456',
      },
      type: 'messages',
    },

    {
      attributes: {
        attachment: true,
        body: null,
        category: 'TEST_RESULTS',
        messageId: 789,
        readReceipt: 'READ',
        recipientId: 1,
        recipientName: 'Veteran',
        senderId: 2,
        senderName: 'Clinician',
        sentDate: '2016-11-15T18:33:05.000Z',
        subject: 'Question About Test Results',
      },
      id: '789',
      links: {
        self: 'http://www.example.com/my_health/v1/messaging/messages/789',
      },
      type: 'messages',
    },
  ],

  links: {
    first:
      'http://www.example.com/my_health/v1/messaging/folders/0/messages?page=1&per_page=10',
    last:
      'http://www.example.com/my_health/v1/messaging/folders/0/messages?page=1&per_page=10',
    next: null,
    prev: null,
    self: 'http://www.example.com/my_health/v1/messaging/folders/0/messages?',
  },

  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalEntries: 2,
      totalPages: 1,
    },
    sort: {
      sentDate: 'DESC',
    },
  },
};

export const messagesError = {
  errors: [
    {
      title: 'Operation failed',
      detail: 'The Page Size must be less than total message count',
      code: 'VA900',
      status: '400',
    },
    {
      title: 'Error',
      detail: 'Not authorized for access to secure messages',
      status: '403',
    },
  ],
};

export const folderSuccess = {
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
        self: 'http://www.example.com//my_health/v1/messaging/folders/0',
      },
    },
    {
      id: '1',
      type: 'folders',
      attributes: {
        folderId: 0,
        name: 'Favorites',
        count: 55,
        unreadCount: 7,
        systemFolder: false,
      },
      links: {
        self: 'http://www.example.com//my_health/v1/messaging/folders/0',
      },
    },
  ],
  links: {
    self:
      'http://www.example.com/my_health/v1/messaging/folders?page=1&per_page=999&use_cache=false',
    first:
      'http://www.example.com/my_health/v1/messaging/folders?page=1&per_page=999&use_cache=false',
    prev: null,
    next: null,
    last:
      'http://www.example.com//my_health/v1/messaging/folders?page=1&per_page=999&use_cache=false',
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

export const folderError = {
  errors: [
    {
      title: 'Error',
      detail: 'Unauthorized',
      status: '401',
    },
    {
      title: 'Error',
      detail: 'Not authorized for access to secure messages',
      status: '403',
    },
  ],
};

export const recipientSuccess = {
  data: [
    {
      id: '7026562',
      type: 'triage_teams',
      attributes: {
        triageTeamId: 7026562,
        name: '###ABC_XYZ_TRIAGE_TEAM_PCMM_ASSOCIATION_747###',
        stationNumber: '989',
        blockedStatus: false,
        relationType: 'PATIENT',
        preferredTeam: true,
      },
    },
  ],
};

export const recipientError = folderError;
