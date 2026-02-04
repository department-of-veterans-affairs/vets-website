import constants from 'vets-json-schema/dist/constants.json';
import ADDRESS_DATA from 'platform/forms/address/data';
import * as SCHEDULING_PREFERENCES from './schedulingPreferencesConstants';

export const DEFAULT_ERROR_MESSAGE = `We’re sorry. We can’t update your information right now. We’re working to fix this problem. Try again later.`;

export const MILITARY_STATES = new Set(ADDRESS_DATA.militaryStates);

export const ADDRESS_FORM_VALUES = {
  STATES: constants.states.USA.map(state => state.value),
  COUNTRIES: constants.countries.map(country => country.label),
  COUNTRY_ISO3_CODES: constants.countries.map(country => country.value),
  MILITARY_STATES,
};

export const ADDRESS_TYPES = {
  DOMESTIC: 'DOMESTIC',
  INTERNATIONAL: 'INTERNATIONAL',
  OVERSEAS_MILITARY: 'OVERSEAS MILITARY',
};

// TODO: Merge with ADDRESS_TYPES above, or replace them both with the
// ADDRESS_TYPES constant in platform/forms/address/helpers.js
export const ADDRESS_TYPES_ALTERNATE = Object.freeze({
  domestic: 'DOMESTIC',
  international: 'INTERNATIONAL',
  military: 'MILITARY',
});

export const ADDRESS_POU = {
  CORRESPONDENCE: 'CORRESPONDENCE',
  RESIDENCE: 'RESIDENCE',
};

export const MILITARY_BASE_DATA = 'view:livesOnMilitaryBase';

// address props that are primarily used for comparing two addresses
export const ADDRESS_PROPS = [
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'city',
  'countryCodeIso3',
  'internationalPostalCode',
  'province',
  'stateCode',
  'zipCode',
];

export const USA = {
  COUNTRY_NAME: 'United States',
  COUNTRY_CODE: '1',
  COUNTRY_ISO3_CODE: 'USA',
};

export const TRANSACTION_CATEGORY_TYPES = {
  PHONE: 'AsyncTransaction::VAProfile::PhoneTransaction',
  EMAIL: 'AsyncTransaction::VAProfile::EmailTransaction',
  ADDRESS: 'AsyncTransaction::VAProfile::AddressTransaction',
};

export const TRANSACTION_STATUS = {
  REJECTED: 'REJECTED',
  RECEIVED: 'RECEIVED',
  RECEIVED_ERROR_QUEUE: 'RECEIVED_ERROR_QUEUE',
  RECEIVED_DEAD_LETTER_QUEUE: 'RECEIVED_DEAD_LETTER_QUEUE',
  COMPLETED_SUCCESS: 'COMPLETED_SUCCESS',
  COMPLETED_NO_CHANGES_DETECTED: 'COMPLETED_NO_CHANGES_DETECTED',
  COMPLETED_FAILURE: 'COMPLETED_FAILURE',
};

export const INIT_VAP_SERVICE_ID = 'initializeVAProfileServiceID';

export const PERSONAL_INFO_FIELD_NAMES = {
  PREFERRED_NAME: 'preferredName',
  PRONOUNS: 'pronouns',
  GENDER_IDENTITY: 'genderIdentity',
  SEXUAL_ORIENTATION: 'sexualOrientation',
  MESSAGING_SIGNATURE: 'messagingSignature',
};

export const FIELD_NAMES = {
  ...PERSONAL_INFO_FIELD_NAMES,
  ...SCHEDULING_PREFERENCES.FIELD_NAMES,
  HOME_PHONE: 'homePhone',
  MOBILE_PHONE: 'mobilePhone',
  WORK_PHONE: 'workPhone',
  EMAIL: 'email',
  MAILING_ADDRESS: 'mailingAddress',
  RESIDENTIAL_ADDRESS: 'residentialAddress',
};

export const FIELD_TITLES = Object.freeze({
  ...SCHEDULING_PREFERENCES.FIELD_TITLES,
  [FIELD_NAMES.PREFERRED_NAME]: 'Preferred name',
  [FIELD_NAMES.PRONOUNS]: 'Pronouns',
  [FIELD_NAMES.GENDER_IDENTITY]: 'Gender identity',
  [FIELD_NAMES.SEXUAL_ORIENTATION]: 'Sexual orientation',
  [FIELD_NAMES.MESSAGING_SIGNATURE]: 'Messages signature',
  [FIELD_NAMES.HOME_PHONE]: 'Home phone number',
  [FIELD_NAMES.MOBILE_PHONE]: 'Mobile phone number',
  [FIELD_NAMES.WORK_PHONE]: 'Work phone number',
  [FIELD_NAMES.EMAIL]: 'Contact email address',
  [FIELD_NAMES.MAILING_ADDRESS]: 'Mailing address',
  [FIELD_NAMES.RESIDENTIAL_ADDRESS]: 'Home address',
});

// optional 'hint text' to display below field titles
export const FIELD_TITLE_DESCRIPTIONS = {
  [FIELD_NAMES.EMAIL]: 'We use this email to send you information.',
  [FIELD_NAMES.MAILING_ADDRESS]:
    'We send your VA letters, bills, and prescriptions to this address.',
  [FIELD_NAMES.RESIDENTIAL_ADDRESS]: 'This is where you currently live.',
  [FIELD_NAMES.HOME_PHONE]: 'We use this phone number to contact you.',
  [FIELD_NAMES.MOBILE_PHONE]: 'We use this phone number to contact you.',
  [FIELD_NAMES.WORK_PHONE]: 'We use this phone number to contact you.',
};

// These are intended to be used as values for HTML element id attributes
export const FIELD_IDS = {
  ...SCHEDULING_PREFERENCES.FIELD_IDS,
  [FIELD_NAMES.PREFERRED_NAME]: 'preferred-name',
  [FIELD_NAMES.PRONOUNS]: 'pronouns',
  [FIELD_NAMES.GENDER_IDENTITY]: 'gender-identity',
  [FIELD_NAMES.SEXUAL_ORIENTATION]: 'sexual-orientation',
  [FIELD_NAMES.MESSAGING_SIGNATURE]: 'messaging-signature',
  [FIELD_NAMES.HOME_PHONE]: 'home-phone-number',
  [FIELD_NAMES.MOBILE_PHONE]: 'mobile-phone-number',
  [FIELD_NAMES.WORK_PHONE]: 'work-phone-number',
  [FIELD_NAMES.EMAIL]: 'contact-email-address',
  [FIELD_NAMES.MAILING_ADDRESS]: 'mailing-address',
  [FIELD_NAMES.RESIDENTIAL_ADDRESS]: 'home-address',
  phoneNumbers: 'phone-numbers',
};

export const FIELD_SECTION_HEADERS = {
  ...SCHEDULING_PREFERENCES.FIELD_SECTION_HEADERS,
  // These section headers are used on /profile/edit when returning to scheduling preferences
  [FIELD_NAMES.MAILING_ADDRESS]:
    SCHEDULING_PREFERENCES.FIELD_SECTION_HEADERS[
      FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD
    ],
  [FIELD_NAMES.HOME_PHONE]:
    SCHEDULING_PREFERENCES.FIELD_SECTION_HEADERS[
      FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD
    ],
  [FIELD_NAMES.MOBILE_PHONE]:
    SCHEDULING_PREFERENCES.FIELD_SECTION_HEADERS[
      FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD
    ],
  [FIELD_NAMES.WORK_PHONE]:
    SCHEDULING_PREFERENCES.FIELD_SECTION_HEADERS[
      FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD
    ],
  [FIELD_NAMES.EMAIL]:
    SCHEDULING_PREFERENCES.FIELD_SECTION_HEADERS[
      FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD
    ],
};

export const PHONE_TYPE = {
  [FIELD_NAMES.MOBILE_PHONE]: 'MOBILE',
  [FIELD_NAMES.WORK_PHONE]: 'WORK',
  [FIELD_NAMES.HOME_PHONE]: 'HOME',
};

export const ANALYTICS_FIELD_MAP = {
  ...SCHEDULING_PREFERENCES.ANALYTICS_FIELD_MAP,
  INIT_VAP_SERVICE_ID: 'initialize-vet360-id',
  primaryTelephone: 'primary-telephone',
  alternateTelephone: 'alternative-telephone',
  [FIELD_NAMES.PREFERRED_NAME]: 'preferred-name',
  [FIELD_NAMES.PRONOUNS]: 'pronouns',
  [FIELD_NAMES.GENDER_IDENTITY]: 'gender-identity',
  [FIELD_NAMES.SEXUAL_ORIENTATION]: 'sexual-orientation',
  [FIELD_NAMES.MESSAGING_SIGNATURE]: 'messaging-signature',
  [FIELD_NAMES.HOME_PHONE]: 'home-telephone',
  [FIELD_NAMES.MOBILE_PHONE]: 'mobile-telephone',
  [FIELD_NAMES.WORK_PHONE]: 'work-telephone',
  [FIELD_NAMES.EMAIL]: 'email',
  [FIELD_NAMES.MAILING_ADDRESS]: 'mailing-address',
  [FIELD_NAMES.RESIDENTIAL_ADDRESS]: 'home-address',
  smsOptin: 'sms-optin',
  smsOptout: 'sms-optout',
};

export const API_ROUTES = {
  ...SCHEDULING_PREFERENCES.API_ROUTES,
  INIT_VAP_SERVICE_ID: '/profile/initialize_vet360_id',
  TELEPHONES: '/profile/telephones',
  EMAILS: '/profile/email_addresses',
  ADDRESSES: '/profile/addresses',
  PREFERRED_NAME: '/profile/preferred_names',
  GENDER_IDENTITY: '/profile/gender_identities',
  MESSAGING_SIGNATURE: '/messaging/preferences/signature',
};

export const VAP_SERVICE_INITIALIZATION_STATUS = {
  INITIALIZED: 'INITIALIZED',
  INITIALIZING: 'INITIALIZING',
  INITIALIZATION_FAILURE: 'INITIALIZATION_FAILURE',
  UNINITIALIZED: 'UNINITIALIZED',
};

export const ACTIVE_EDIT_VIEWS = {
  ADDRESS_VALIDATION: 'addressValidation',
};

export const MISSING_CONTACT_INFO = {
  ALL: 'ALL',
  EMAIL: 'EMAIL',
  MOBILE: 'MOBILE',
};

export const COPY_ADDRESS_MODAL_STATUS = {
  CHECKING: 'checking',
  PROMPT: 'prompt',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

export const NOT_SET_TEXT = 'This information is not available right now.';
