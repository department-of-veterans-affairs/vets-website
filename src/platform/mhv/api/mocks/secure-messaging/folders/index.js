const allFolders = {
  data: [
    {
      id: '0',
      type: 'folders',
      attributes: {
        folderId: 0,
        name: 'Inbox',
        count: 54,
        unreadCount: 0,
        systemFolder: true,
      },
      links: {
        self: 'http://127.0.0.1:3000/my_health/v1/messaging/folders/0',
      },
    },
    {
      id: '-1',
      type: 'folders',
      attributes: {
        folderId: -1,
        name: 'Sent',
        count: 10,
        unreadCount: 10,
        systemFolder: true,
      },
      links: {
        self: 'http://127.0.0.1:3000/my_health/v1/messaging/folders/-1',
      },
    },
    {
      id: '-2',
      type: 'folders',
      attributes: {
        folderId: -2,
        name: 'Drafts',
        count: 15,
        unreadCount: 15,
        systemFolder: true,
      },
      links: {
        self: 'http://127.0.0.1:3000/my_health/v1/messaging/folders/-2',
      },
    },
    {
      id: '-3',
      type: 'folders',
      attributes: {
        folderId: -3,
        name: 'Deleted',
        count: 2,
        unreadCount: 0,
        systemFolder: true,
      },
      links: {
        self: 'http://127.0.0.1:3000/my_health/v1/messaging/folders/-3',
      },
    },
    {
      id: '123456',
      type: 'folders',
      attributes: {
        folderId: 123456,
        name: 'Test 1',
        count: 1,
        unreadCount: 0,
        systemFolder: false,
      },
      links: {
        self: 'http://127.0.0.1:3000/my_health/v1/messaging/folders/123456',
      },
    },
    {
      id: '123457',
      type: 'folders',
      attributes: {
        folderId: 123457,
        name: 'Empty Folder',
        count: 0,
        unreadCount: 0,
        systemFolder: false,
      },
      links: {
        self: 'http://127.0.0.1:3000/my_health/v1/messaging/folders/123457',
      },
    },
  ],
  links: {
    self:
      'http://127.0.0.1:3000//my_health/v1/messaging/folders?page=1&per_page=999&use_cache=false',
    first:
      'http://127.0.0.1:3000//my_health/v1/messaging/folders?page=1&per_page=100&use_cache=false',
    prev: null,
    next: null,
    last:
      'http://127.0.0.1:3000//my_health/v1/messaging/folders?page=1&per_page=100&use_cache=false',
  },
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 100,
      totalPages: 1,
      totalEntries: 25,
    },
  },
};

const oneFolder = (req, res) => {
  const { index } = req.params;
  return res.json({
    data: allFolders.data.find(folder => folder.id === index),
  });
};

const newFolder = (req, res) => {
  const { name } = req.body;
  return res.json({
    data: {
      id: '3885308',
      type: 'folders',
      attributes: {
        name,
        count: 0,
        unreadCount: 0,
        systemFolder: false,
        folderId: 3885308,
      },
      links: {
        self:
          'https://staging-api.va.gov/my_health/v1/messaging/folders/3885308',
      },
    },
  });
};

const renameFolder = (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  return res.json({
    data: {
      id: index,
      type: 'folders',
      attributes: {
        name,
        count: 0,
        unreadCount: 0,
        systemFolder: false,
        folderId: index,
      },
      links: {
        self: `https://127.0.0.1/my_health/v1/messaging/folders/${index}`,
      },
    },
  });
};

const deleteFolder = (req, res) => {
  return res.status(204).json({});
};

module.exports = {
  allFolders,
  oneFolder,
  newFolder,
  renameFolder,
  deleteFolder,
};
