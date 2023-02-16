/** time to wait (in ms) after the user stops typing before initiating draft auto-save */
export const draftAutoSaveTimeout = 15000;

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
    BLOCKED_MESSAGE_ERROR:
      'You are blocked from sending messages to this recipient.',
    CANNOT_REPLY_BODY:
      "The last message in this conversation is more than 45 days old. If you want to continue this conversation, you'll need to start a new message.",
    CANNOT_REPLY_INFO_HEADER: 'This conversation is too old for new replies',
    GET_MESSAGE_ERROR: 'We’re sorry. Something went wrong on our end.',
    DELETE_MESSAGE_SUCCESS: 'Message was successfully moved to Trash.',
    DELETE_MESSAGE_ERROR:
      'Message could not be deleted. Try again later. If this problem persists, contact the help desk.',
    DRAFT_CANNOT_REPLY_INFO_HEADER:
      'This conversation is too old for new replies',
    DRAFT_CANNOT_REPLY_INFO_BODY: `The last message in this conversation is more than 45 days old. If you want to continue this conversation, you'll need to start a new message.`,
    MOVE_MESSAGE_SUCCESS: 'Message was successfully moved',
    MOVE_MESSAGE_ERROR:
      'Message could not be moved. Try again later. If this problem persists, contact the help desk.',
    NO_MESSAGES: 'There are no messages in this folder.',
    DELETE_DRAFT_SUCCESS: 'Draft was successfully deleted.',
    DELETE_DRAFT_ERROR:
      'Draft could not be deleted. Try again later. If this problem persists, contact the help desk.',
    SEND_MESSAGE_SUCCESS: 'Message was successfully sent.',
    SEND_MESSAGE_ERROR: 'We’re sorry. Something went wrong on our end.',
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

export const Errors = {
  Code: {
    BLOCKED_USER: 'SM151',
  },
};

export const Links = {
  Link: {
    CANNOT_REPLY: {
      CLASSNAME: 'fas fa-edit vads-u-margin-right--1 vads-u-margin-top--1',
      TITLE: 'Start a new message',
      TO: '/compose',
    },
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
    DELETE_DRAFT_CONFIRM: 'Are you sure you want to delete this draft?',
    DELETE_DRAFT_CONFIRM_NOTE:
      "Drafts are permanently deleted and this action can't be undone. \n\n Deleting a draft won't affect other messages in this conversation.",
  },
};
export const Breadcrumbs = {
  COMPOSE: {
    path: '/compose',
    label: 'Compose message',
  },
  INBOX: { path: '/inbox', label: 'Inbox' },
  DRAFTS: { path: '/drafts', label: 'Drafts' },
  DRAFT: { path: '/draft', label: 'Drafts' },
  FOLDERS: { path: '/folders', label: 'My folders' },
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

export const Categories = {
  OTHER: 'General',
  COVID: 'COVID',
  APPOINTMENTS: 'Appointment',
  MEDICATIONS: 'Medication',
  TEST_RESULTS: 'Test',
  EDUCATION: 'Education',
};

export const acceptedFileTypes = {
  doc: 'application/msword',
  docx:
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  pdf: 'application/pdf',
  png: 'image/png',
  rtf: 'text/rtf',
  txt: 'text/plain',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export const Attachments = {
  MAX_FILE_COUNT: 4,
  MAX_FILE_SIZE: 6000000,
  TOTAL_MAX_FILE_SIZE: 10000000,
};
