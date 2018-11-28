import { MILITARY_STATES } from '../../../../letters/utils/constants';

import states from './states.json';
import countries from './countries.json';

export const ADDRESS_FORM_VALUES = {
  STATES: states.map(state => state.stateCode),
  COUNTRIES: countries.map(country => country.countryName),
  MILITARY_STATES,
};

export const ADDRESS_TYPES = {
  DOMESTIC: 'DOMESTIC',
  INTERNATIONAL: 'INTERNATIONAL',
  OVERSEAS_MILITARY: 'OVERSEAS_MILITARY',
};

export const ADDRESS_POU = {
  CORRESPONDENCE: 'CORRESPONDENCE',
  RESIDENCE: 'RESIDENCE/CHOICE',
};

export const USA = {
  COUNTRY_NAME: 'United States',
  COUNTRY_CODE: '1',
};

export const TRANSACTION_CATEGORY_TYPES = {
  PHONE: 'AsyncTransaction::Vet360::PhoneTransaction',
  EMAIL: 'AsyncTransaction::Vet360::EmailTransaction',
  ADDRESS: 'AsyncTransaction::Vet360::AddressTransaction',
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

export const INIT_VET360_ID = 'initializeVet360ID';

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

export const PHONE_TYPE = {
  mobilePhone: 'MOBILE',
  workPhone: 'WORK',
  temporaryPhone: 'TEMPORARY',
  faxNumber: 'FAX',
  homePhone: 'HOME',
};

export const ANALYTICS_FIELD_MAP = {
  INIT_VET360_ID: 'initialize-vet360-id',
  primaryTelephone: 'primary-telephone',
  alternateTelephone: 'alternative-telephone',
  homePhone: 'home-telephone',
  mobilePhone: 'mobile-telephone',
  workPhone: 'work-telephone',
  faxNumber: 'fax-telephone',
  email: 'email',
  mailingAddress: 'mailing-address',
  residentialAddress: 'home-address',
};

export const API_ROUTES = {
  INIT_VET360_ID: '/profile/initialize_vet360_id',
  TELEPHONES: '/profile/telephones',
  EMAILS: '/profile/email_addresses',
  ADDRESSES: '/profile/addresses',
};

export const VET360_INITIALIZATION_STATUS = {
  INITIALIZED: 'INITIALIZED',
  INITIALIZING: 'INITIALIZING',
  INITIALIZATION_FAILURE: 'INITIALIZATION_FAILURE',
  UNINITALIZED: 'UNINITALIZED',
};
