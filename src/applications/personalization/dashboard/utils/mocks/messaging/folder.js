import environment from 'platform/utilities/environment';

export const mockFolderResponse = {
  data: {
    id: '0',
    type: 'folders',
    attributes: {
      folderId: 0,
      name: 'Inbox',
      count: 3,
      unreadCount: 3,
      systemFolder: false,
    },
    links: {
      self: `${environment.API_URL}/v0/messaging/health/folders/0`,
    },
  },
};
