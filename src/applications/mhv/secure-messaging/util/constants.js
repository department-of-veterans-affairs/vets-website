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
    CANNOT_REPLY_BODY: "Please select 'Compose' to create a new message.",
    CANNOT_REPLY_INFO_HEADER:
      'You cannot reply to a message that is older than 45 days.',
    GET_MESSAGE_ERROR: 'We’re sorry. Something went wrong on our end.',
    DELETE_MESSAGE_SUCCESS: 'Message was successfully moved to Trash.',
    DELETE_MESSAGE_ERROR:
      'Message could not be deleted. Try again later. If this problem persists, contact the help desk.',
    MOVE_MESSAGE_SUCCESS: 'Message was successfully moved',
    MOVE_MESSAGE_ERROR:
      'Message could not be moved. Try again later. If this problem persists, contact the help desk.',
    NO_MESSAGES: 'There are no messages in this folder.',
    DELETE_DRAFT_SUCCESS: 'Draft was successfully discarded.',
    DELETE_DRAFT_ERROR:
      'Draft could not be discarded. Try again later. If this problem persists, contact the help desk.',
  },
  Folder: {
    CREATE_FOLDER_SUCCESS: 'Folder was successfully created.',
    CREATE_FOLDER_ERROR:
      'Folder could not be created. Try again later. If this problem persists, contact the help desk.',
    DELETE_FOLDER_SUCCESS: 'Folder was successfully removed.',
    DELETE_FOLDER_ERROR:
      'Folder could not be removed. Try again later. If this problem persists, contact the help desk.',
    RENAME_FOLDER_SUCCESS: 'Folder was successfully renamed.',
    RENAME_FOLDER_ERROR:
      'Folder could not be renamed. Try again later. If this problem persists, contact the help desk.',
    FOLDER_NAME_TAKEN:
      'That folder name is already in use. Please use another name.',
  },
};

export const Prompts = {
  Message: {
    DELETE_MESSAGE_CONFIRM:
      'Are you sure you want to move this message to the trash?',
    DELETE_MESSAGE_CONFIRM_NOTE:
      'Messages in the trash folder won’t be permanently deleted.',
  },
  Draft: {
    DISCARD_DRAFT_CONFIRM: 'Are you sure you want to discard this draft?',
    DISCARD_DRAFT_CONFIRM_NOTE:
      "Drafts are permanently deleted and this action can't be undone. \n\n Deleting a draft won't affect other messages in this conversation.",
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
  SEARCH_ADVANCED: { path: '/advanced', label: 'Advanced search' },
  SEARCH_RESULTS: { path: '/results', label: 'Search results' },
  FAQ: { path: '/faq', label: 'Messages FAQs' },
};

export const ALERT_TYPE_ERROR = 'error';
export const ALERT_TYPE_SUCCESS = 'success';
export const ALERT_TYPE_WARNING = 'warning';
export const ALERT_TYPE_INFO = 'info';
