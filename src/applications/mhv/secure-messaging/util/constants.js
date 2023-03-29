/** time to wait (in ms) after the user stops typing before initiating draft auto-save */
export const draftAutoSaveTimeout = 5000;

export const DefaultFolders = {
  INBOX: {
    id: 0,
    header: 'Inbox',
    desc: '',
  },
  SENT: {
    id: -1,
    header: 'Sent messages',
    desc: '',
  },
  DRAFTS: { id: -2, header: 'Drafts', desc: '' },
  DELETED: {
    id: -3,
    header: 'Trash',
    desc: `These are the messages you moved to the trash from your inbox or folders. We won't permanently delete any messages.`,
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
    DELETE_MESSAGE_SUCCESS: 'Message thread was successfully moved to Trash.',
    DELETE_MESSAGE_ERROR:
      'Message thread could not be deleted. Try again later. If this problem persists, contact the help desk.',
    DRAFT_CANNOT_REPLY_INFO_HEADER:
      'This conversation is too old for new replies',
    DRAFT_CANNOT_REPLY_INFO_BODY: `The last message in this conversation is more than 45 days old. If you want to continue this conversation, you'll need to start a new message.`,
    MOVE_MESSAGE_SUCCESS: 'Message was successfully moved',
    MOVE_MESSAGE_ERROR:
      'Message could not be moved. Try again later. If this problem persists, contact the help desk.',
    MOVE_MESSAGE_THREAD_SUCCESS: 'Message thread was successfully moved.',
    MOVE_MESSAGE_THREAD_ERROR:
      'Message thread could not be moved. Try again later. If this problem persists, contact the help desk.',
    NO_MESSAGES: 'There are no messages in this folder.',
    DELETE_DRAFT_SUCCESS: 'Draft was successfully deleted.',
    DELETE_DRAFT_ERROR:
      'Draft could not be deleted. Try again later. If this problem persists, contact the help desk.',
    SEND_MESSAGE_SUCCESS: 'Message was successfully sent.',
    SEND_MESSAGE_ERROR: 'We’re sorry. Something went wrong on our end.',
  },

  Folder: {
    CREATE_FOLDER_MODAL_HEADER: 'Create a new folder',
    CREATE_FOLDER_MODAL_LABEL: 'Folder name',
    CREATE_FOLDER_SUCCESS: 'Folder was successfully created.',
    CREATE_FOLDER_ERROR:
      'Folder could not be created. Try again later. If this problem persists, contact the help desk.',
    CREATE_FOLDER_ERROR_NOT_BLANK: 'Folder name cannot be blank',
    CREATE_FOLDER_ERROR_CHAR_TYPE:
      'Folder name can only contain letters, numbers, and spaces.',
    CREATE_FOLDER_ERROR_EXSISTING_NAME:
      'Folder name already in use. Please use another name.',
    DELETE_FOLDER_CONFIRM_HEADER:
      'Are you sure you want to remove this folder?',
    DELETE_FOLDER_CONFIRM_BODY:
      "If you remove a folder, you can't get it back.",
    DELETE_FOLDER_SUCCESS: 'Folder was successfully removed.',
    DELETE_FOLDER_ERROR:
      'Folder could not be removed. Try again later. If this problem persists, contact the help desk.',
    DELETE_FOLDER_ERROR_NOT_EMPTY_HEADER:
      'Empty this folder before removing it from the list.',
    DELETE_FOLDER_ERROR_NOT_EMPTY_BODY:
      'Before this folder can be removed, all of the messages in it must be moved to another folder, such as Trash, Inbox, or a different custom folder.',
    RENAME_FOLDER_SUCCESS: 'Folder was successfully renamed.',
    RENAME_FOLDER_ERROR:
      'Folder could not be renamed. Try again later. If this problem persists, contact the help desk.',
    FOLDER_NAME_TAKEN:
      'That folder name is already in use. Please use another name.',
  },
  Thread: {
    GET_THREAD_ERROR: 'We’re sorry. Something went wrong on our end.',
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
  Compose: {
    EDIT_LIST_TITLE: 'Edit your contact list',
    EDIT_LIST_CONTENT:
      'You can edit your contact list on the My HealtheVet website. Then refresh this page to review your updated list.',
  },
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

export const threadSortingOptions = {
  DESCENDING: 'DESC',
  ASCENDING: 'ASC',
  SORT_BY_SENDER: 'SENDER_NAME',
  SORT_BY_RECEPIENT: 'RECIPIENT_NAME',
  SORT_BY_SENT_DATE: 'SENT_DATE',
  SORT_BY_DRAFT_DATE: 'DRAFT_DATE',
};
