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
  RECIPIENTS: '/recipients',
  SIGNATURE: '/signature',
};

export const Locators = {
  HEADER: 'h1',
  FOLDERS: '[data-testid ="my-folders-sidebar"]',
  FILTER_BTN: '[data-testid="filter-messages-button"]',
  DraftsPage: {
    SEND_BTN: '[data-testid="Send-Button"]',
  },
  InboxPage: {
    COMPOSE_MESSAGE: '[data-testid="compose-message-link"]',
    CONTINUE_BTN: '[data-testid="continue-button"]',
  },
};
