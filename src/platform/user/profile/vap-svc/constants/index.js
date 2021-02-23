import { MILITARY_STATES } from 'applications/letters/utils/constants';

import { states } from 'vets-json-schema/dist/constants.json';
import countries from './countries.json';

export const ADDRESS_FORM_VALUES = {
  STATES: states.USA.map(state => state.value),
  COUNTRIES: countries.map(country => country.countryName),
  COUNTRY_ISO3_CODES: countries.map(country => country.countryCodeISO3),
  MILITARY_STATES,
};

export const ADDRESS_TYPES = {
  DOMESTIC: 'DOMESTIC',
  INTERNATIONAL: 'INTERNATIONAL',
  OVERSEAS_MILITARY: 'OVERSEAS MILITARY',
};

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
  [FIELD_NAMES.HOME_PHONE]: 'Home phone number',
  [FIELD_NAMES.MOBILE_PHONE]: 'Mobile phone number',
  [FIELD_NAMES.WORK_PHONE]: 'Work phone number',
  [FIELD_NAMES.TEMP_PHONE]: 'Temporary phone number',
  [FIELD_NAMES.FAX_NUMBER]: 'Fax number',
  [FIELD_NAMES.EMAIL]: 'Email address',
  [FIELD_NAMES.MAILING_ADDRESS]: 'Mailing address',
  [FIELD_NAMES.RESIDENTIAL_ADDRESS]: 'Home address',
};

export const PHONE_TYPE = {
  mobilePhone: 'MOBILE',
  workPhone: 'WORK',
  temporaryPhone: 'TEMPORARY',
  faxNumber: 'FAX',
  homePhone: 'HOME',
};

export const ANALYTICS_FIELD_MAP = {
  INIT_VAP_SERVICE_ID: 'initialize-vet360-id',
  primaryTelephone: 'primary-telephone',
  alternateTelephone: 'alternative-telephone',
  homePhone: 'home-telephone',
  mobilePhone: 'mobile-telephone',
  workPhone: 'work-telephone',
  faxNumber: 'fax-telephone',
  email: 'email',
  mailingAddress: 'mailing-address',
  residentialAddress: 'home-address',
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
