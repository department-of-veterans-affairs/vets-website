import constants from 'vets-json-schema/dist/constants.json';
import countries from './countries.json';

import ADDRESS_DATA from 'platform/forms/address/data';

export const MILITARY_STATES = new Set(ADDRESS_DATA.militaryStates);

export const ADDRESS_FORM_VALUES = {
  STATES: constants.states.USA.map(state => state.value),
  COUNTRIES: countries.map(country => country.countryName),
  COUNTRY_ISO3_CODES: countries.map(country => country.countryCodeISO3),
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
  RESIDENCE: 'RESIDENCE/CHOICE',
};

export const USA = {
  COUNTRY_NAME: 'United States',
  COUNTRY_CODE: '1',
  COUNTRY_ISO3_CODE: 'USA',
};

// TODO: After https://github.com/department-of-veterans-affairs/va.gov-team/issues/19858
// is completed and is live on prod, we can update this object to remove the
// `Vet360` instances:
//
// PHONE: 'AsyncTransaction::VAProfile::PhoneTransaction',
// EMAIL: 'AsyncTransaction::VAProfile::EmailTransaction',
// ADDRESS: 'AsyncTransaction::VAProfile::AddressTransaction',
//
export const TRANSACTION_CATEGORY_TYPES = {
  PHONE: 'AsyncTransaction::Vet360::PhoneTransaction',
  EMAIL: 'AsyncTransaction::Vet360::EmailTransaction',
  ADDRESS: 'AsyncTransaction::Vet360::AddressTransaction',
  VAP_PHONE: 'AsyncTransaction::VAProfile::PhoneTransaction',
  VAP_EMAIL: 'AsyncTransaction::VAProfile::EmailTransaction',
  VAP_ADDRESS: 'AsyncTransaction::VAProfile::AddressTransaction',
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

export const FIELD_NAMES = {
  PREFERRED_NAME: 'preferredName',
  PRONOUNS: 'pronouns',
  GENDER_IDENTITY: 'genderIdentity',
  SEXUAL_ORIENTATION: 'sexualOrientation',
  HOME_PHONE: 'homePhone',
  MOBILE_PHONE: 'mobilePhone',
  WORK_PHONE: 'workPhone',
  TEMP_PHONE: 'temporaryPhone',
  FAX_NUMBER: 'faxNumber',
  EMAIL: 'email',
  MAILING_ADDRESS: 'mailingAddress',
  RESIDENTIAL_ADDRESS: 'residentialAddress',
};

export const FIELD_TITLES = {
  [FIELD_NAMES.PREFERRED_NAME]: 'Preferred name',
  [FIELD_NAMES.PRONOUNS]: 'Pronouns',
  [FIELD_NAMES.GENDER_IDENTITY]: 'Gender identity',
  [FIELD_NAMES.SEXUAL_ORIENTATION]: 'Sexual orientation',
  [FIELD_NAMES.HOME_PHONE]: 'Home phone number',
  [FIELD_NAMES.MOBILE_PHONE]: 'Mobile phone number',
  [FIELD_NAMES.WORK_PHONE]: 'Work phone number',
  [FIELD_NAMES.TEMP_PHONE]: 'Temporary phone number',
  [FIELD_NAMES.FAX_NUMBER]: 'Fax number',
  [FIELD_NAMES.EMAIL]: 'Contact email address',
  [FIELD_NAMES.MAILING_ADDRESS]: 'Mailing address',
  [FIELD_NAMES.RESIDENTIAL_ADDRESS]: 'Home address',
};

// These are intended to be used as values for HTML element id attributes
export const FIELD_IDS = {
  [FIELD_NAMES.PREFERRED_NAME]: 'preferred-name',
  [FIELD_NAMES.PRONOUNS]: 'pronouns',
  [FIELD_NAMES.GENDER_IDENTITY]: 'gender-identity',
  [FIELD_NAMES.SEXUAL_ORIENTATION]: 'sexual-orientation',
  [FIELD_NAMES.HOME_PHONE]: 'home-phone-number',
  [FIELD_NAMES.MOBILE_PHONE]: 'mobile-phone-number',
  [FIELD_NAMES.WORK_PHONE]: 'work-phone-number',
  [FIELD_NAMES.TEMP_PHONE]: 'temporary-phone-number',
  [FIELD_NAMES.FAX_NUMBER]: 'fax-number',
  [FIELD_NAMES.EMAIL]: 'contact-email-address',
  [FIELD_NAMES.MAILING_ADDRESS]: 'mailing-address',
  [FIELD_NAMES.RESIDENTIAL_ADDRESS]: 'home-address',
  phoneNumbers: 'phone-numbers',
};

export const PHONE_TYPE = {
  [FIELD_NAMES.MOBILE_PHONE]: 'MOBILE',
  [FIELD_NAMES.WORK_PHONE]: 'WORK',
  [FIELD_NAMES.TEMP_PHONE]: 'TEMPORARY',
  [FIELD_NAMES.FAX_NUMBER]: 'FAX',
  [FIELD_NAMES.HOME_PHONE]: 'HOME',
};

export const ANALYTICS_FIELD_MAP = {
  INIT_VAP_SERVICE_ID: 'initialize-vet360-id',
  primaryTelephone: 'primary-telephone',
  alternateTelephone: 'alternative-telephone',
  [FIELD_NAMES.PREFERRED_NAME]: 'preferred-name',
  [FIELD_NAMES.PRONOUNS]: 'pronouns',
  [FIELD_NAMES.GENDER_IDENTITY]: 'gender-identity',
  [FIELD_NAMES.SEXUAL_ORIENTATION]: 'sexual-orientation',
  [FIELD_NAMES.HOME_PHONE]: 'home-telephone',
  [FIELD_NAMES.MOBILE_PHONE]: 'mobile-telephone',
  [FIELD_NAMES.WORK_PHONE]: 'work-telephone',
  [FIELD_NAMES.FAX_NUMBER]: 'fax-telephone',
  [FIELD_NAMES.EMAIL]: 'email',
  [FIELD_NAMES.MAILING_ADDRESS]: 'mailing-address',
  [FIELD_NAMES.RESIDENTIAL_ADDRESS]: 'home-address',
  smsOptin: 'sms-optin',
  smsOptout: 'sms-optout',
};

export const API_ROUTES = {
  INIT_VAP_SERVICE_ID: '/profile/initialize_vet360_id',
  TELEPHONES: '/profile/telephones',
  EMAILS: '/profile/email_addresses',
  ADDRESSES: '/profile/addresses',
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
