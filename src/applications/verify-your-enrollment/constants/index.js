import manifest from '../manifest.json';

export const BASE_URL = `${manifest.rootUrl}/`;

export const CHANGE_OF_DIRECT_DEPOSIT_TITLE = 'Direct deposit information';
export const DIRECT_DEPOSIT_BUTTON_TEXT = 'Add or update account';
export const CHANGE_OF_ADDRESS_TITLE = 'Contact information';
export const ADDRESS_BUTTON_TEXT = 'Edit';

export const SMALL_SCREEN = 481;

export const ENROLLMETS_PER_PAGE = 6;

// add field title to make it a required field for the change of address form
export const addressFormRequiredData = [
  'countryCodeIso3',
  'addressLine1',
  'city',
  'stateCode',
];

// Regex that uses a negative lookahead to check that a string does NOT contain
// things like `http`, `www.`, or a few common TLDs.
export const blockURLsRegEx =
  '^((?!http|www\\.|\\.co|\\.net|\\.gov|\\.edu|\\.org).)*$';

// export const STREET_LINE_MAX_LENGTH = 20;
