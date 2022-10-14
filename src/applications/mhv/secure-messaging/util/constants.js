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

export const Alerts = {
  Message: {
    DELETE_MESSAGE_SUCCESS: 'Message was successfully moved to Trash.',
    DELETE_MESSAGE_ERROR:
      'Message could not be deleted. Try again later. If this problem persists, contact the help desk.',
  },
};

export const Prompts = {
  Message: {
    DELETE_MESSAGE_CONFIRM:
      'Are you sure you want to move this message to the trash?',
    DELETE_MESSAGE_CONFIRM_NOTE:
      'Messages in the trash folder won’t be permanently deleted.',
  },
};
export const Breadcrumbs = {
  COMPOSE: {
    path: '/compose',
    label: 'Compose message',
  },
  DRAFTS: { path: '/drafts', label: 'Drafts' },
  DRAFT: { path: '/draft', label: 'Drafts' },
  FOLDERS: { path: '/folders', label: 'Folders' },
  SENT: { path: '/sent', label: 'Sent messages' },
  TRASH: { path: '/trash', label: 'Trash' },
  SEARCH: { path: '/search', label: 'Search messages' },
  SEARCH_ADVANCED: { path: '/search?advanced=true', label: 'Advanced search' },
  FAQ: { path: '/faq', label: 'Messages FAQs' },
};

export const ALERT_TYPE_ERROR = 'error';
export const ALERT_TYPE_SUCCESS = 'success';
export const ALERT_TYPE_WARNING = 'warning';
