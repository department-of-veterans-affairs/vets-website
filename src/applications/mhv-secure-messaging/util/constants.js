import manifest from '../manifest.json';

/** time to wait (in ms) after the user stops typing before initiating draft auto-save */
export const draftAutoSaveTimeout = 10000;

export const Paths = {
  MYHEALTH: '/my-health',
  MESSAGES: '/',
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
  CONTACT_LIST: '/contact-list/',
  RECENT_CARE_TEAMS: '/new-message/recent/',
  SELECT_HEALTH_CARE_SYSTEM: 'select-health-care-system/',
  SELECT_CARE_TEAM: 'select-care-team/',
  START_MESSAGE: 'start-message/',
  CARE_TEAM_HELP: '/new-message/care-team-help/',
  ROOT_URL: manifest.rootUrl,
};

export const DefaultFolders = {
  INBOX: {
    id: 0,
    header: 'Inbox',
    desc: 'Communicate securely with your VA health care team.',
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
    VALID_RECIPIENT_REQUIRED: 'Please select a valid recipient.',
    CATEGORY_REQUIRED: 'Please select a category.',
    CHECKBOX_REQUIRED: 'You must certify by checking the box.',
    SUBJECT_REQUIRED: 'Subject cannot be blank.',
    BODY_REQUIRED: 'Message body cannot be blank.',
    SIGNATURE_REQUIRED: 'Enter your full name',
    VALID_SIGNATURE_REQUIRED: 'This field accepts alphabetic characters only',
    CONT_SAVING_DRAFT: {
      title: 'Do you want to save your draft message?',
      cancelButtonText: 'Save draft', // top button - save draft and remain on page
      confirmButtonText: 'Delete draft', // bottom button - delete draft and leave page
    },
    CONT_SAVING_DRAFT_CHANGES: {
      title: 'Do you want to save your changes to this draft?',
      cancelButtonText: 'Save changes', // top button - save draft and remain on page
      confirmButtonText: 'Delete changes', // bottom button - delete draft and leave page
    },
    UNABLE_TO_SAVE: {
      title: "We can't save this message yet",
      p1:
        "We need more information from you before we can save this draft. You can continue editing your draft and then save it. Or you can delete it. If you delete a draft, you can't get it back.",
      cancelButtonText: 'Edit draft', // top button - close modal and remain on page
      confirmButtonText: 'Delete draft', // bottom button - delete draft and leave page
    },
    UNABLE_TO_SAVE_DRAFT_ATTACHMENT: {
      title: "We can't save attachments in a draft message",
      p1:
        "If you save this message as a draft, you'll need to attach your files again when you're ready to send the message.",
      cancelButtonText: 'Edit draft', // top button - close modal and remain on page
      confirmButtonText: 'Save draft without attachments', // bottom button - save draft and leave page
    },
    UNABLE_TO_SAVE_DRAFT_SIGNATURE_OR_ATTACHMENTS: {
      title: "We can't save your signature or attachments in a draft message",
      cancelButtonText: 'Edit draft', // top button - close modal and remain on page
      confirmButtonText: 'Save draft without signature or attachments', // bottom button - save draft and leave page
    },
    UNABLE_TO_SAVE_DRAFT_SIGNATURE: {
      title: "We can't save your signature in a draft message",
      cancelButtonText: 'Edit draft', // top button - close modal and remain on page
      confirmButtonText: 'Save draft without signature', // bottom button - save draft and leave page
    },
    UNABLE_TO_SAVE_OTHER: 'Something went wrong... Failed to save message.',
    ATTACHMENTS: {
      FILE_EMPTY: 'Your file is empty. Try attaching a different file.',
      INVALID_FILE_TYPE: `We can't attach this file type. Try attaching a DOC, DOCX, GIF, JPG, JPEG, PDF, PNG, RTF, TXT, XLS, XLSX, JFIF, PJPEG, or PJP.`,
      INVALID_FILE_TYPE_EXTENDED: `We can't attach this file type. Try attaching a DOC, DOCX, GIF, JPG, JPEG, PDF, PNG, RTF, TXT, XLS, XLSX, BMP, TIFF, TIF, PPT, PPTX, PPS, PPSX, ODT, MP4, M4V, MOV, WMV, MPG, JFIF, PJPEG, or PJP.`,
      FILE_DUPLICATE: 'You have already attached this file.',
      FILE_TOO_LARGE:
        'Your file is too large. Try attaching a file smaller than 6MB.',
      FILE_TOO_LARGE_LARGE_UPLOAD:
        'Your file is too large. Try attaching a file smaller than 25MB.',
      TOTAL_MAX_FILE_SIZE_EXCEEDED:
        'Your files are too large. The total size of all files must be smaller than 10MB.',
      TOTAL_MAX_FILE_SIZE_EXCEEDED_LARGE:
        'Your files are too large. The total size of all files must be smaller than 25MB.',
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
    UNABLE_TO_SAVE_DRAFT_SIGNATURE_ERROR: 'unable to save draft with signature',
    UNABLE_TO_SAVE_DRAFT_ATTACHMENT_SIGNATURE_ERROR:
      'unable to save draft with attachment and signature',
    CONT_SAVING_DRAFT_ERROR: 'your draft is not saved',
    CONT_SAVING_DRAFT_CHANGES_ERROR: 'your draft changes are not saved',
  },
  ContactList: {
    SAVE_AND_EXIT: {
      title: 'Do you want to save your changes to your contact list?',
      confirmButtonText: 'Save',
      cancelButtonText: 'Delete changes and exit',
    },
    MINIMUM_SELECTION: 'Select at least one team',
  },
};

export const Alerts = {
  Message: {
    BLOCKED_MESSAGE_ERROR:
      'You are blocked from sending messages to this recipient.',
    CANNOT_REPLY_BODY:
      'If you need to contact your care team, start a new message.',
    STALE_REPLY_BODY: {
      MAIN: 'The last message in this conversation is more than 45 days old.',
      VISTA:
        "If you want to continue this conversation, you'll need to start a new message.",
      OH:
        'If you want to continue this conversation directly with your provider, call your VA health facility. Ask to speak to the My HealtheVet coordinator or secure messaging administrator.',
      OH_CONTACT:
        'Or you can send a message to other care teams in your contact list.',
    },
    CANNOT_REPLY_INFO_HEADER: "You can't reply to this message",
    STALE_REPLY_INFO_HEADER: 'This conversation is too old for new replies',
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
    SEND_MESSAGE_SUCCESS: 'Message sent',
    SEND_MESSAGE_ERROR: 'We’re sorry. Something went wrong on our end.',
    SERVER_ERROR_503:
      'We’re sorry. We couldn’t load this page. Try again later.',
    SAVE_CONTACT_LIST_SUCCESS: 'Contact list changes saved',
    ATTACHMENT_SCAN_FAIL:
      'Our file scanner found a problem with your attachment. To send your message, remove this attachment.',
    MULTIPLE_ATTACHMENTS_SCAN_FAIL:
      'Our file scanner found a problem with your attachments. To send your message, remove the attachments.',
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
    RENAME_FOLDER_SUCCESS: 'Folder renamed',
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
  ContactList: {
    CANNOT_SAVE:
      "We're sorry. We couldn't save your changes. Try saving again.",
  },
  Headers: {
    HIDE_ALERT: 'HIDE_ALERT',
  },
};

export const Errors = {
  Code: {
    BLOCKED_USER: 'SM119',
    BLOCKED_USER2: 'SM151',
    TG_NOT_ASSOCIATED: 'SM129',
    SERVICE_OUTAGE: '503',
    ATTACHMENT_SCAN_FAIL: 'SM172',
  },
};

export const Prompts = {
  Attachment: {
    REMOVE_ATTACHMENT_TITLE: 'Are you sure you want to remove this attachment?',
    REMOVE_ATTACHMENT_CONTENT:
      'If you remove an attachment, you will have to attach it again.',
  },
  Compose: {
    SIGNATURE_REQUIRED:
      'Messages to this team require a signature. We added a signature box to this page.',
    SIGNATURE_NOT_REQUIRED:
      "Messages to this team don't require a signature. We removed the signature box from this page.",
  },
  Message: {
    DELETE_MESSAGE_CONFIRM:
      'Are you sure you want to move this message to the trash?',
    DELETE_MESSAGE_CONFIRM_NOTE:
      'Messages in the trash folder won’t be permanently deleted.',
  },
  Draft: {
    DELETE_DRAFT_CONFIRM_HEADER: 'Delete this draft?',
    DELETE_DRAFT_CONFIRM_CONTENT: `If you delete a draft, you can’t get it back. But deleting it won’t affect other messages in this conversation.`,
  },
};

export const Breadcrumbs = {
  MYHEALTH: { href: Paths.MYHEALTH, label: 'My HealtheVet' },
  MESSAGES: { href: Paths.MESSAGES, label: 'Messages', isRouterLink: true },
  COMPOSE: {
    href: Paths.COMPOSE,
    label: 'Start a new message',
    isRouterLink: true,
  },
  INBOX: { href: Paths.INBOX, label: 'Inbox', isRouterLink: true },
  DRAFTS: { href: Paths.DRAFTS, label: 'Drafts', isRouterLink: true },
  DRAFT: { href: Paths.DRAFT, label: 'Drafts', isRouterLink: true },
  FOLDERS: { href: Paths.FOLDERS, label: 'More folders', isRouterLink: true },
  SENT: { href: Paths.SENT, label: 'Sent', isRouterLink: true },
  TRASH: { href: Paths.DELETED, label: 'Trash', isRouterLink: true },
  MESSAGE_THREAD: {
    href: Paths.MESSAGE_THREAD,
    label: 'Edit draft',
    isRouterLink: true,
  },
  CONTACT_LIST: {
    href: Paths.CONTACT_LIST,
    label: 'Contact list',
    isRouterLink: true,
  },
  REPLY: {
    href: Paths.REPLY,
    label: 'Reply',
    isRouterLink: true,
  },
};

export const InnerNavigationPaths = [
  {
    path: Paths.INBOX,
    label: Breadcrumbs.INBOX.label,
    datatestid: 'inbox-inner-nav',
  },
  {
    path: Paths.SENT,
    label: Breadcrumbs.SENT.label,
    datatestid: 'sent-inner-nav',
  },
  {
    path: Paths.FOLDERS,
    label: Breadcrumbs.FOLDERS.label,
    datatestid: 'folders-inner-nav',
  },
];

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

export const SelectCareTeamPage = {
  CANT_FIND_CARE_TEAM_NOTE: `If you can’t find the care team you want to select, update your contact list to add it here.`,
  CANT_FIND_CARE_TEAM_LINK: `Learn what to do if you can’t find your care team`,
};

export const MessageHintText = {
  RX_RENEWAL_ERROR: 'Include as many of these medication details as possible.',
  RX_RENEWAL_SUCCESS: 'Review the medication details we added to your message.',
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
  jfif: 'image/jfif',
  pjpeg: 'image/pjpeg',
  pjp: 'image/pjp',
};

export const acceptedFileTypesExtended = {
  doc: 'application/msword',
  docx:
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  pdf: 'application/pdf',
  png: 'image/png',
  rtf: 'application/rtf', // corrected from 'text/rtf' to 'application/rtf' for wider compatibility
  txt: 'text/plain',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  tif: 'image/tiff', // common alias
  ppt: 'application/vnd.ms-powerpoint',
  pptx:
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  pps: 'application/vnd.ms-powerpoint',
  ppsx:
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  odt: 'application/vnd.oasis.opendocument.text',
  mp4: 'video/mp4',
  m4v: 'video/x-m4v',
  mov: 'video/quicktime',
  wmv: 'video/x-ms-wmv',
  mpg: 'video/mpeg',
  jfif: 'image/jfif',
  pjpeg: 'image/pjpeg',
  pjp: 'image/pjp',
};

export const Attachments = {
  MAX_FILE_COUNT: 4,
  MAX_FILE_COUNT_LARGE: 10,
  MAX_FILE_SIZE: 6 * 1024 * 1024, // 6 MB
  MAX_FILE_SIZE_LARGE: 25 * 1024 * 1024, // 25 MB
  TOTAL_MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  TOTAL_MAX_FILE_SIZE_LARGE: 25 * 1024 * 1024, // 25 MB
};

export const ElectronicSignatureBox = {
  TITLE: 'Electronic signature',
  DESCRIPTION:
    'You need to sign all new messages you send to this team. Enter your full name here to sign your message.',
  FULLNAME_LABEL: 'Your full name',
  CHECKBOX_LABEL:
    'I certify that the above is correct and true to the best of my knowledge and belief.',
  NOTE_PARAGRAPH:
    'According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or for providing incorrect information (Reference: 18 U.S.C. 1001).',
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

export const THREADS_PER_PAGE_DEFAULT = 10;

export const BreadcrumbViews = {
  DESKTOP_VIEW:
    'desktop-view vads-u-margin-left--neg7 vads-u-font-weight--bold vads-u-font-size--md vads-u-padding-y--2',
  MOBILE_VIEW: 'mobile-view vads-u-margin-left--neg3 vads-u-padding-y--0p5',
};

export const PageTitles = {
  DEFAULT_PAGE_TITLE_TAG: ' | Veterans Affairs',
  MY_FOLDERS_PAGE_TITLE_TAG: 'More folders | Veterans Affairs',
  CONVERSATION_TITLE_TAG: 'Conversation | Veterans Affairs',
  EDIT_DRAFT_PAGE_TITLE_TAG:
    'Edit draft - MHV Secure Messaging | Veterans Affairs',
  CARE_TEAM_HELP_TITLE_TAG: 'Care Team Help - Start Message | Veterans Affairs',
};

export const PageHeaders = {
  RECENT_RECIPIENTS: 'Care teams you recently sent messages to',
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
  CONTACT_LIST: 'Contact list',
};

export const RecipientStatus = {
  BLOCKED: 'Blocked',
  ALLOWED: 'Allowed',
  NOT_ASSOCIATED: 'Not Associated',
};

/**
 * OH (Oracle Health) migration phases that block message replies.
 * During facility migration from VistA to Oracle Health, replies are blocked
 * during certain phases (T-6 through T+2).
 * - p3: T-6 to T-3
 * - p4: T-3 to T-1
 * - p5: T to T+2
 */
export const OhMigrationPhasesBlockingReplies = ['p3', 'p4', 'p5'];

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

export const RxRenewalText = {
  LOCKED_CATEGORY_DISPLAY: 'Medication',
};

export const downtimeNotificationParams = {
  appTitle: 'this messaging tool',
};

export const filterDescription = {
  noMsgId: 'Enter information from one of these fields: to, from, or subject',
  withMsgId:
    'Enter information from one of these fields: to, from, subject, or message ID',
};

export const smFooter = {
  HAVE_QUESTIONS: 'Have questions about how messages works?',
  LEARN_MORE: 'Learn more about messages',
  CONTACT_FACILITY:
    'Want to send a message to a care team that’s not on your list? Contact your VA health facility. Ask for the My HealtheVet coordinator or secure messaging administrator.',
  FIND_FACILITY: 'Find your VA health facility',
  NEED_HELP: 'Need help?',
};

export const teamNotListedReasons = [
  'Your account isn’t connected to the care team.',
  'The care team doesn’t use secure messaging.',
  'Your care team is part of a different VA health care system.',
  'You removed the care team from your contact list.',
];
