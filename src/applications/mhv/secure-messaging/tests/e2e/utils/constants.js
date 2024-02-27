export const AXE_CONTEXT = '.secure-messaging-container';

export const Paths = {
  UI_MAIN: '/my-health/secure-messages',
  SM_API_BASE: '/my_health/v1/messaging',
  SM_API_EXTENDED: '/my_health/v1/messaging/messages',
  INBOX: '/inbox/',
  SENT: '/sent/',
  DRAFTS: '/drafts/',
  DRAFT: '/draft/',
  DELETED: '/trash/',
  COMPOSE: '/new-message/',
  MESSAGE: '/message/',
  MESSAGE_THREAD: '/thread/',
  FOLDERS: '/folders',
  SEARCH: '/search/',
  SEARCH_RESULTS: '/search/results/',
  REPLY: '/reply/',
  CATEGORIES: '/categories',
  RECIPIENTS: '/allrecipients',
  SIGNATURE: '/signature',
};

export const Locators = {
  SELECT: '#select',
  HEADER: 'h1',
  FOLDERS_LIST: '[data-testid ="my-folders-sidebar"]',
  MESSAGES: '[data-testid="message-list-item"]',
  THREADS: '[data-testid="thread-list-item"]',
  FOLDERS: {
    INBOX: '[data-testid="inbox-sidebar"]',
    DRAFTS: '[data-testid="drafts-sidebar"]',
    SENT: '[data-testid="sent-sidebar"]',
    TRASH: '[data-testid="trash-sidebar"]',
    CUSTOM: '[data-testid="my-folders-sidebar"]',
  },
  BUTTONS: {
    REPLY: '[data-testid="reply-button-body"]',
    CONTINUE: '[data-testid="continue-button"]',
    BUTTON_MOVE: 'button:contains("Move")',
    BUTTON_TRASH: 'button:contains("Trash")',
    FILTER: '[data-testid="filter-messages-button"]',
    SEND: '[data-testid="Send-Button"]',
    SAVE_DRAFT: '#save-draft-button',
    DELETE_DRAFT: '#delete-draft-button',
    CREATE_FOLDER: '[data-testid="create-new-folder"]',
    EDIT_FOLDER: '[data-testid="edit-folder-button"]',
    PRINT: '[data-testid="print-button"]',
  },
  LINKS: {
    GO_TO_INBOX: '[data-testid="inbox-link"]',
    CREATE_NEW_MESSAGE: '[data-testid="compose-message-link"]',
  },
  ALERTS: {
    PAGE_TITLE: '.page-title',
    EXPANDABLE_TITLE: '[class="alert-expandable-title"]',
    SAVE_DRAFT: '#messagetext',
    SIDEBAR_NAV: '[class="sidebar-navigation-messages-list-header"]',
    INBOX_TEXT: '[text="Go to your inbox"]',
    WELCOME_MESSAGE: '.welcome-message',
    BACK_TOP: 'va-back-to-top',
    ACC_ITEM: '[data-testid="faq-accordion-item"]',
    BLOCKED_GROUP: '[data-testid="blocked-triage-group-alert"]',
    REPT_SELECT: '[data-testid="compose-recipient-select"]',
    MESS_CATAGO: '[data-testid="compose-message-categories"]',
  },
};

export const Alerts = {
  NO_ASSOCIATION: {
    AT_ALL_HEADER: `You're not connected to any care teams in this messaging tool`,
    HEADER: 'Your account is no longer connected to',
    PARAGRAPH:
      'If you need to contact your care team, call your VA health facility.',
    LINK: 'Find your VA health facility',
  },
  BLOCKED: {
    HEADER: `You can't send messages to`,
    PARAGRAPH:
      'If you need to contact this care team, call your VA health facility.',
    LINK: 'Find your VA health facility',
  },
};
