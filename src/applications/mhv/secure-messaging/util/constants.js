/** time to wait (in ms) after the user stops typing before initiating draft auto-save */
export const draftAutoSaveTimeout = 10000;

export const Paths = {
  INBOX: '/inbox/',
  SENT: '/sent/',
  DRAFTS: '/drafts/',
  DRAFT: '/draft/',
  DELETED: '/trash/',
  COMPOSE: '/new-message/',
  MESSAGE_THREAD: '/thread/',
  FOLDERS: '/folders/',
  SEARCH: '/search/',
  SEARCH_RESULTS: '/search/results/',
  REPLY: '/reply/',
};

export const DefaultFolders = {
  INBOX: {
    id: 0,
    header: 'Inbox',
    desc: '',
  },
  SENT: {
    id: -1,
    header: 'Sent',
    desc: '',
  },
  DRAFTS: { id: -2, header: 'Drafts', desc: '' },
  DELETED: {
    id: -3,
    header: 'Trash',
    desc: `These are the messages you moved to the trash from your inbox or folders. We won't permanently delete any messages.`,
  },
  CUSTOM_FOLDER: {
    desc: `This is a folder you created. You can add conversations to this folder by moving them from your inbox or other folders.`,
  },
};

export const MessageReadStatus = {
  READ: 'READ',
  UNREAD: null,
};

export const ErrorMessages = {
  LandingPage: {
    GET_INBOX_ERROR: 'Unable to retrieve messages at this moment',
  },
  ComposeForm: {
    RECIPIENT_REQUIRED: 'Please select a recipient.',
    CATEGORY_REQUIRED: 'Please select a category.',
    SUBJECT_REQUIRED: 'Subject cannot be blank.',
    BODY_REQUIRED: 'Message body cannot be blank.',
    UNABLE_TO_SAVE: {
      title: "We can't save this message yet",
      p1: 'We need more information from you before we can save this draft.',
      p2:
        "You can continue editing your draft and then save it. Or you can delete it. If you delete a draft, you can't get it back.",
    },
    UNABLE_TO_SAVE_DRAFT_ATTACHMENT: {
      title: "We can't save attachments in a draft message",
      p1:
        "If you save this message as a draft, you'll need to attach your files again when you're ready to send the message.",
      saveDraft: 'Save draft without attachments',
      editDraft: 'Keep editing',
    },
    UNABLE_TO_SAVE_OTHER: 'Something went wrong... Failed to save message.',
    ATTACHMENTS: {
      FILE_EMPTY: 'Your file is empty. Try attaching a different file.',
      INVALID_FILE_TYPE: `We can't attach this file type. Try attaching a DOC, JPG, PDF, PNG, RTF, TXT, or XLS.`,
      FILE_DUPLICATE: 'You have already attached this file.',
      FILE_TOO_LARGE:
        'Your file is too large. Try attaching a file smaller than 6MB.',
      TOTAL_MAX_FILE_SIZE_EXCEEDED:
        'Your files are too large. The total size of all files must be smaller than 10MB.',
    },
  },
  SearchForm: {
    FOLDER_REQUIRED: 'Please select a folder.',
    KEYWORD_REQUIRED: 'Please enter a keyword.',
    START_DATE_REQUIRED: 'Please enter a start date.',
    END_DATE_REQUIRED: 'Please enter an end date.',
    START_DATE_AFTER_END_DATE: 'Start date must be on or before end date.',
    END_DATE_BEFORE_START_DATE: 'End date must be on or after start date.',
    END_YEAR_GREATER_THAN_CURRENT_YEAR:
      'End year must not be greater than current year.',
    NO_FIELDS_SELECTED_MODAL_HEADER:
      "Please use at least one of the following search fields or choose a date range other than 'any'.",
    SEARCH_TERM_REQUIRED: 'Please enter a search term.',
  },
  MoveConversation: {
    FOLDER_REQUIRED: 'Please select a folder to move the message to.',
  },
  ManageFolders: {
    FOLDER_NAME_REQUIRED: 'Folder name cannot be blank',
    FOLDER_NAME_EXISTS: 'Folder name already in use. Please use another name.',
    FOLDER_NAME_INVALID_CHARACTERS:
      'Folder name can only contain letters, numbers, and spaces.',
  },
  Navigation: {
    UNABLE_TO_SAVE_DRAFT_ATTACHMENT_ERROR:
      'unable to save draft with attachment error',
    UNABLE_TO_SAVE_ERROR: 'no attachments and navigating away',
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
    DELETE_MESSAGE_SUCCESS:
      'Message conversation was successfully moved to Trash.',
    DELETE_MESSAGE_ERROR:
      'Message could not be deleted. Try again later. If this problem persists, contact the help desk.',
    DRAFT_CANNOT_REPLY_INFO_HEADER:
      'This conversation is too old for new replies',
    DRAFT_CANNOT_REPLY_INFO_BODY: `The last message in this conversation is more than 45 days old. If you want to continue this conversation, you'll need to start a new message.`,
    MOVE_MESSAGE_SUCCESS: 'Message was successfully moved',
    MOVE_MESSAGE_ERROR:
      'Message could not be moved. Try again later. If this problem persists, contact the help desk.',
    MOVE_MESSAGE_THREAD_SUCCESS: 'Message conversation was successfully moved.',
    MOVE_MESSAGE_THREAD_ERROR:
      'Message conversation could not be moved. Try again later. If this problem persists, contact the help desk.',
    NO_MESSAGES: 'There are no messages in this folder.',
    DELETE_DRAFT_SUCCESS: 'Draft was successfully deleted.',
    DELETE_DRAFT_ERROR:
      'Draft could not be deleted. Try again later. If this problem persists, contact the help desk.',
    SEND_MESSAGE_SUCCESS: 'Secure message was successfully sent.',
    SEND_MESSAGE_ERROR: 'We’re sorry. Something went wrong on our end.',
    SERVER_ERROR_503:
      'We’re sorry. We couldn’t load this page. Try again later.',
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
    DELETE_FOLDER_CONFIRM_HEADER: 'Remove this folder?',
    DELETE_FOLDER_CONFIRM_BODY:
      "If you remove a folder, you can't get it back.",
    DELETE_FOLDER_SUCCESS: 'Folder was successfully removed.',
    DELETE_FOLDER_ERROR:
      'Folder could not be removed. Try again later. If this problem persists, contact the help desk.',
    DELETE_FOLDER_ERROR_NOT_EMPTY_HEADER: 'Empty this folder',
    DELETE_FOLDER_ERROR_NOT_EMPTY_BODY: `You can't remove a folder with messages in it. Move all the messages to another folder. Then try removing it again.`,
    RENAME_FOLDER_SUCCESS: 'Folder was successfully renamed.',
    RENAME_FOLDER_ERROR:
      'Folder could not be renamed. Try again later. If this problem persists, contact the help desk.',
    FOLDER_NAME_TAKEN:
      'That folder name is already in use. Please use another name.',
    GET_FOLDER_ERROR: 'We’re sorry. Something went wrong on our end.',
  },
  Thread: {
    GET_THREAD_ERROR: 'We’re sorry. Something went wrong on our end.',
    THREAD_NOT_FOUND_ERROR: 'This conversation was not found.',
  },
};

export const Errors = {
  Code: {
    BLOCKED_USER: 'SM119',
    BLOCKED_USER2: 'SM151',
    TG_NOT_ASSOCIATED: 'SM129',
    SERVICE_OUTAGE: '503',
  },
};

export const Links = {
  Link: {
    CANNOT_REPLY: {
      CLASSNAME: 'fas fa-edit vads-u-margin-right--1 vads-u-margin-top--1',
      TITLE: 'Start a new message',
      TO: Paths.COMPOSE,
    },
  },
};

export const Prompts = {
  Attachment: {
    REMOVE_ATTACHMENT_TITLE: 'Are you sure you want to remove this attachment?',
    REMOVE_ATTACHMENT_CONTENT:
      'If you remove an attachment, you will have to attach it again.',
  },
  Compose: {
    EDIT_PREFERENCES_TITLE: 'Edit your message preferences',
    EDIT_PREFERENCES_CONTENT:
      'You can edit your contact list or signature settings on the My HealtheVet website. Then refresh this page to review your updated list.',
    EDIT_PREFERENCES_LINK: `Edit your message preferences on the My HealtheVet website 
    (opens in a new tab)`,
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
    DELETE_NEW_DRAFT_TITLE: 'Delete this draft?',
    DELETE_NEW_DRAFT_CONTENT: `If you delete a draft, you can't get it back.`,
  },
};

export const Breadcrumbs = {
  MESSAGES: { path: '/', label: 'Back to messages' },
  COMPOSE: {
    path: Paths.COMPOSE,
    label: 'Start a new message',
  },
  INBOX: { path: Paths.INBOX, label: 'Back to inbox' },
  DRAFTS: { path: Paths.DRAFTS, label: 'Drafts' },
  DRAFT: { path: Paths.DRAFT, label: 'Drafts' },
  FOLDERS: { path: Paths.FOLDERS, label: 'Back to my folders' },
  SENT: { path: Paths.SENT, label: 'Sent' },
  TRASH: { path: Paths.DELETED, label: 'Trash' },
};

export const ALERT_TYPE_ERROR = 'error';
export const ALERT_TYPE_SUCCESS = 'success';
export const ALERT_TYPE_WARNING = 'warning';
export const ALERT_TYPE_INFO = 'info';

export const Categories = {
  OTHER: 'General',
  OTHERS: 'General',
  COVID: 'COVID',
  APPOINTMENTS: 'Appointment',
  MEDICATIONS: 'Medication',
  TEST_RESULTS: 'Test',
  TEST_RESULT: 'Test',
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
  SENT_DATE_DESCENDING: {
    sortField: 'SENT_DATE',
    sortOrder: 'DESC',
    value: 'SENT_DATE_DESCENDING',
    label: 'Newest to oldest',
  },
  SENT_DATE_ASCENDING: {
    sortField: 'SENT_DATE',
    sortOrder: 'ASC',
    value: 'SENT_DATE_ASCENDING',
    label: 'Oldest to newest',
  },
  DRAFT_DATE_DESCENDING: {
    sortField: 'DRAFT_DATE',
    sortOrder: 'DESC',
    value: 'DRAFT_DATE_DESCENDING',
    label: 'Newest to oldest',
  },
  DRAFT_DATE_ASCENDING: {
    sortField: 'DRAFT_DATE',
    sortOrder: 'ASC',
    value: 'DRAFT_DATE_ASCENDING',
    label: 'Oldest to newest',
  },
  SENDER_ALPHA_DESCENDING: {
    sortField: 'SENDER_NAME',
    sortOrder: 'DESC',
    value: 'SENDER_ALPHA_DESCENDING',
    label: 'Z to A - Sender’s name',
  },
  SENDER_ALPHA_ASCENDING: {
    sortField: 'SENDER_NAME',
    sortOrder: 'ASC',
    value: 'SENDER_ALPHA_ASCENDING',
    label: 'A to Z - Sender’s name',
  },
  RECEPIENT_ALPHA_DESCENDING: {
    sortField: 'RECIPIENT_NAME',
    sortOrder: 'DESC',
    value: 'RECEPIENT_ALPHA_DESCENDING',
    label: 'Z to A - Recipient’s name',
  },
  RECEPIENT_ALPHA_ASCENDING: {
    sortField: 'RECIPIENT_NAME',
    sortOrder: 'ASC',
    value: 'RECEPIENT_ALPHA_ASCENDING',
    label: 'A to Z - Recipient’s name',
  },
};

export const BreadcrumbViews = {
  DESKTOP_VIEW: 'desktop-view vads-u-margin-left--neg7',
  MOBILE_VIEW: 'mobile-view vads-u-margin-left--neg3 vads-u-margin-y--0',
};

export const PageTitles = {
  DEFAULT_PAGE_TITLE_TAG: 'Messages - MHV Secure Messaging | Veterans Affairs',
  PAGE_TITLE_TAG: '- MHV Secure Messaging | Veterans Affairs',
  EDIT_DRAFT_PAGE_TITLE_TAG:
    'Edit draft - MHV Secure Messaging | Veterans Affairs',
  MY_FOLDERS_PAGE_TITLE_TAG:
    'My folders - MHV Secure Messaging | Veterans Affairs',
};

export const Recipients = {
  CARE_TEAM: 'Care Team',
  FACILITY: 'Facility',
};

export const ParentComponent = {
  COMPOSE_FORM: 'Compose Form',
  FOLDER_HEADER: 'Folder Header',
  MESSAGE_THREAD: 'Message Thread',
  REPLY_FORM: 'Reply Form',
};

export const RecipientStatus = {
  BLOCKED: 'Blocked',
  ALLOWED: 'Allowed',
  NOT_ASSOCIATED: 'Not Associated',
};

export const BlockedTriageAlertStyles = {
  INFO: 'info',
  WARNING: 'warning',
  ALERT: 'alert',
};

export const BlockedTriageAlertText = {
  alertTitle: {
    NO_ASSOCIATIONS:
      "You're not connected to any care teams in this messaging tool",
    ALL_TEAMS_BLOCKED: "You can't send messages to your care teams right now",
    MULTIPLE_TEAMS_BLOCKED:
      "You can't send messages to some of your care teams",
  },
  alertMessage: {
    NO_ASSOCIATIONS:
      'If you need to contact your care team, call your VA health facility.',
    ALL_TEAMS_BLOCKED:
      'If you need to contact your care teams, call your VA health facility.',
    SINGLE_FACILITY_BLOCKED:
      'If you need to contact these care teams, call the facility.',
    SINGLE_TEAM_BLOCKED:
      'If you need to contact this care team, call your VA health facility.',
    MULTIPLE_TEAMS_BLOCKED:
      'If you need to contact these care teams, call your VA health facility.',
  },
};

export const FormLabels = {
  CATEGORY: 'Category',
  MESSAGE: 'Message',
  SUBJECT: 'Subject',
};

export const CernerTransitioningFacilities = {
  NORTH_CHICAGO: {
    facilityId: '556',
  },
};
