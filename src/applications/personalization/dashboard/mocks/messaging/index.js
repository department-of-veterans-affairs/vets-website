const allFolders = {
  data: [
    {
      attributes: {
        count: 3,
        folderId: 0,
        name: 'Inbox',
        systemFolder: true,
        unreadCount: 0,
      },
      id: '0',
      links: {
        self: 'http://www.example.com/my_health/v1/messaging/folders/0',
      },
      type: 'folders',
    },

    {
      attributes: {
        count: 3,
        folderId: -2,
        name: 'Drafts',
        systemFolder: true,
        unreadCount: 3,
      },
      id: '-2',
      links: {
        self: 'http://www.example.com/my_health/v1/messaging/folders/-2',
      },
      type: 'folders',
    },

    {
      attributes: {
        count: 5,
        folderId: -1,
        name: 'Sent',
        systemFolder: true,
        unreadCount: 0,
      },
      id: '-1',
      links: {
        self: 'http://www.example.com/my_health/v1/messaging/folders/-1',
      },
      type: 'folders',
    },

    {
      attributes: {
        count: 0,
        folderId: -3,
        name: 'Deleted',
        systemFolder: true,
        unreadCount: 0,
      },
      id: '-3',
      links: {
        self: 'http://www.example.com/my_health/v1/messaging/folders/-3',
      },
      type: 'folders',
    },

    {
      attributes: {
        count: 1,
        folderId: 123,
        name: 'Test Folder 1',
        systemFolder: false,
        unreadCount: 0,
      },
      id: '123',
      links: {
        self: 'http://www.example.com/my_health/v1/messaging/folders/123',
      },
      type: 'folders',
    },

    {
      attributes: {
        count: 2,
        folderId: 456,
        name: 'Test Folder 2',
        systemFolder: false,
        unreadCount: 0,
      },
      id: '456',
      links: {
        self: 'http://www.example.com/my_health/v1/messaging/folders/456',
      },
      type: 'folders',
    },
  ],

  links: {
    first:
      'http://www.example.com/my_health/v1/messaging/folders?page=1&per_page=100',
    last:
      'http://www.example.com/my_health/v1/messaging/folders?page=1&per_page=100',
    next: null,
    prev: null,
    self: 'http://www.example.com/my_health/v1/messaging/folders?per_page=100',
  },

  meta: {
    pagination: {
      currentPage: 1,
      perPage: 100,
      totalEntries: 7,
      totalPages: 1,
    },
  },
};

const allFoldersWithUnreadMessages = {
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
    {
      id: '-1',
      type: 'folders',
      attributes: {
        folderId: -1,
        name: 'Sent',
        count: 1098,
        unreadCount: 51,
        systemFolder: true,
      },
      links: {
        self: 'https://staging-api.va.gov/my_health/v1/messaging/folders/-1',
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
        self: 'https://staging-api.va.gov/my_health/v1/messaging/folders/1',
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

const messages = {
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

const recipients = {
  data: [
    {
      attributes: {
        name: 'Triage Team 1',
        relationType: 'PATIENT',
        triageTeamId: 0,
      },
      id: '0',
      type: 'triage_teams',
    },
    {
      attributes: {
        name: 'Triage Team 2',
        relationType: 'PATIENT',
        triageTeamId: 1,
      },
      id: '1',
      type: 'triage_teams',
    },
    {
      attributes: {
        name: 'Triage Team 1',
        relationType: 'PATIENT',
        triageTeamId: 2,
      },
      id: '2',
      type: 'triage_teams',
    },
  ],
  links: {
    first:
      'https://dev-api.vets.gov/my_health/v1/messaging/recipients?page=1&per_page=10',
    last:
      'https://dev-api.vets.gov/my_health/v1/messaging/recipients?page=1&per_page=10',
    next: null,
    prev: null,
    self: 'https://dev-api.vets.gov/my_health/v1/messaging/recipients?',
  },
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalEntries: 1,
      totalPages: 1,
    },
    sort: {
      name: 'ASC',
    },
  },
};

module.exports = {
  allFolders,
  allFoldersWithUnreadMessages,
  messages,
  recipients,
};
