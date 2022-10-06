export const DefaultFolders = {
  INBOX: {
    id: 0,
    header: 'Messages',
    desc:
      'When you send a message to your care team, it can take up to 3 business days to get a response.',
  },
  SENT: {
    id: -1,
    header: 'Sent messages',
    desc:
      'When you send a message to your care team, it can take up to 3 business days to get a response.',
  },
  DRAFTS: { id: -2, header: 'Drafts', desc: '' },
  DELETED: {
    id: -3,
    header: 'Trash',
    desc: `Here are the messages you deleted from other folders. You can't permanently delete messages.`,
  },
};

export const ALERT_TYPE_ERROR = 'error';
export const ALERT_TYPE_SUCCESS = 'success';
export const ALERT_TYPE_WARNING = 'warning';
