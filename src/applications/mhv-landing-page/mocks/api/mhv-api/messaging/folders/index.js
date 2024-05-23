/* eslint-disable camelcase */
const allFoldersWithUnreadMessages = {
  data: [
    {
      id: '0',
      type: 'folders',
      attributes: {
        folder_id: 0,
        name: 'Inbox',
        count: 260,
        unread_count: 22,
        system_folder: true,
      },
      links: {
        self: 'https://staging-api.va.gov/my_health/v1/messaging/folders/0',
      },
    },
    {
      id: '1',
      type: 'folders',
      attributes: {
        folder_id: 0,
        name: 'Favorites',
        count: 55,
        unread_count: 7,
        system_folder: false,
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
      current_page: 1,
      per_page: 100,
      total_pages: 1,
      total_entries: 14,
    },
  },
};

const oneFolderWithUnreadMessages = {
  data: {
    id: '0',
    type: 'folders',
    attributes: {
      folder_id: 0,
      name: 'Inbox',
      count: 260,
      unread_count: 68,
      system_folder: true,
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
      folder_id: 0,
      name: 'Inbox',
      count: 260,
      unread_count: 0,
      system_folder: true,
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
