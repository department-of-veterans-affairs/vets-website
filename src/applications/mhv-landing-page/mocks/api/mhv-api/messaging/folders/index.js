/* eslint-disable camelcase */
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

const oneFolderWithUnreadMessages = {
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

const oneFolderWithNoUnreadMessages = {
  data: {
    id: '0',
    type: 'folders',
    attributes: {
      folderId: 0,
      name: 'Inbox',
      count: 260,
      unreadCount: 0,
      systemFolder: true,
    },
    links: {
      self: 'https://staging-api.va.gov/my_health/v1/messaging/folders/0',
    },
  },
};

module.exports = {
  allFoldersWithUnreadMessages,
  oneFolderWithUnreadMessages,
  oneFolderWithNoUnreadMessages,
};
