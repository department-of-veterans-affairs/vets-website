import {
  ACTIVE_FILTER_KEY,
  ALL_MEDICATIONS_FILTER_KEY,
  NON_ACTIVE_FILTER_KEY,
  RECENTLY_REQUESTED_FILTER_KEY,
  RENEWAL_FILTER_KEY,
} from './constants';

export const pageType = {
  DETAILS: 'Details Page',
  LIST: 'List Page',
  REFILL: 'Refill Page',
  DOCUMENTATION: 'Documentation',
};

export const dataDogActionNames = {
  medicationsListPage: {
    FILL_OR_REFILL_BUTTON: `Fill or Refill Button - ${pageType.LIST}`,
    MEDICATION_NAME_LINK_IN_CARD: `Medication Name Link In Card - ${
      pageType.LIST
    }`,
    PRINT_ALL_MEDICATIONS_OPTION: `Print All Medications Option - ${
      pageType.LIST
    }`,
    SHOW_MEDICATIONS_IN_ORDER_SELECT: `Show Medications In This Order - ${
      pageType.LIST
    }`,
    SORT_MEDICATIONS_BUTTON: `Sort Medications Button - ${pageType.LIST}`,
    [ALL_MEDICATIONS_FILTER_KEY]: 'All medications filter',
    [ACTIVE_FILTER_KEY]: 'Active filter',
    [RECENTLY_REQUESTED_FILTER_KEY]: 'Recently requested filter',
    [RENEWAL_FILTER_KEY]: 'Renewal needed filter',
    [NON_ACTIVE_FILTER_KEY]: 'Non-active filter',
    APPLY_FILTER_BUTTON: 'Apply filter button',
    RESET_FILTER_BUTTON: 'Reset filter button',
    START_REFILL_REQUEST: `Start a refill request - ${pageType.LIST}`,
    FILTER_LIST_ACCORDION: 'Filter accordion',
    PAGINATION: 'Pagination',
    COMPOSE_A_MESSAGE_LINK: `Compose A Message Link - ${pageType.LIST}`,
    GO_TO_USE_MEDICATIONS_LINK: `Go to use medications link - ${pageType.LIST}`,
    STOP_SHOWING_IPE_FILTERING_HINT: `In production education for filtering - Stop showing this hint`,
    REFILL_ALERT_LINK: `Med Link in Delay Alert - ${pageType.LIST}`,
    GO_TO_SELF_ENTERED_HEALTH_INFORMATION_LINK: `Go to self-entered health information link - ${
      pageType.LIST
    }`,
  },
  detailsPage: {
    COMPOSE_A_MESSAGE_LINK: `Compose A Message Link - ${pageType.DETAILS}`,
    LEARN_TO_RENEW_PRESCRIPTIONS_ACTION_LINK: `Learn How To Renew Prescriptions Action Link - ${
      pageType.DETAILS
    }`,
    RX_DOCUMENTATION_LINK: `Rx Documentation Link - ${pageType.DETAILS}`,
    FILL_THIS_PRESCRIPTION: `Fill this prescription - ${pageType.DETAILS}`,
    REFILLS_ACCORDIAN: 'Refills Accordion',
    REFILLS_PAGINATION: 'Refills Pagination',
    STATUS_INFO_DROPDOWN: `Status info dropdown - ${pageType.DETAILS}`,
  },
  refillPage: {
    GO_TO_YOUR_MEDICATIONS_LIST_ACTION_LINK: `Go To Your Medications List Action Link - ${
      pageType.REFILL
    }`,
    GO_TO_YOUR_MEDICATIONS_LIST_ACTION_LINK_RENEW: `Go To Your Medications List Action Link - ${
      pageType.REFILL
    } - Renew Section`,
    LEARN_TO_RENEW_PRESCRIPTIONS_ACTION_LINK: `Learn How To Renew Prescriptions Action Link - ${
      pageType.REFILL
    } - Renew Section`,
    SELECT_ALL_CHECKBOXES: `Select All Checkbox - ${pageType.REFILL}`,
    SELECT_SINGLE_MEDICATION_CHECKBOX: `Select Single Medication Checkbox - ${
      pageType.REFILL
    }`,
    REQUEST_REFILLS_BUTTON: `Request Refills Button - ${pageType.REFILL}`,
    COMPOSE_A_MESSAGE_LINK: `Compose A Message Link - ${pageType.REFILL}`,
    GO_TO_USE_MEDICATIONS_LINK: `Go to use medications link - ${
      pageType.REFILL
    }`,
    REFILL_ALERT_LINK: `Med Link in Delay Alert - ${pageType.REFILL}`,
    GO_TO_SELF_ENTERED_HEALTH_INFORMATION_LINK: `Go to self-entered health information link - ${
      pageType.REFILL
    }`,
  },
  shared: {
    DOWNLOAD_A_PDF_OF_THIS: 'Download A PDF Of This ',
    DOWNLOAD_A_TEXT_FILE_OF_THIS: 'Download A Text File Of This ',
    PHARMACY_PHONE_NUMBER_LINK: 'Pharmacy Phone Number Link - ',
    PRINT_OR_DOWNLOAD_BUTTON: 'Print Or Download Button - ',
    PRINT: 'Print ',
    WHAT_TO_KNOW_BEFORE_YOU_PRINT_OR_DOWNLOAD_BUTTON:
      'What To Know Before You Print Or Download Button - ',
  },
};
