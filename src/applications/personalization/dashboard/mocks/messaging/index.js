const createUnreadMessagesSuccess = () => {
  return {
    data: {
      id: '0',
      type: 'folders',
      attributes: {
        folderId: 0,
        name: 'Inbox',
        count: 3,
        unreadCount: 3,
        systemFolder: true,
      },
    },
  };
};

module.exports = {
  createUnreadMessagesSuccess,
};
