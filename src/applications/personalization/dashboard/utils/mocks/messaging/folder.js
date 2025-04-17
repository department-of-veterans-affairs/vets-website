import environment from '~/platform/utilities/environment';

export const mockFolderResponse = {
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
        self: `${environment.API_URL}/my_health/v1/messaging/folders/0`,
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
        self: `${environment.API_URL}/my_health/v1/messaging/folders/0`,
      },
    },
  ],
  links: {
    self: `${environment.API_URL}/my_health/v1/messaging/folders?page=1&per_page=999&use_cache=false'`,
    first: `${environment.API_URL}/my_health/v1/messaging/folders?page=1&per_page=999&use_cache=false'`,
    prev: null,
    next: null,
    last: `${environment.API_URL}/my_health/v1/messaging/folders?page=1&per_page=999&use_cache=false'`,
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
