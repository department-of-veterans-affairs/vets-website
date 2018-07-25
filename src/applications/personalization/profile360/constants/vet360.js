export const TRANSACTION_CATEGORY_TYPES = {
  PHONE: 'AsyncTransaction::Vet360::PhoneTransaction',
  EMAIL: 'AsyncTransaction::Vet360::EmailTransaction',
  ADDRESS: 'AsyncTransaction::Vet360::AddressTransaction'
};

export const TRANSACTION_STATUS = {
  REJECTED: 'REJECTED',
  RECEIVED: 'RECEIVED',
  RECEIVED_ERROR_QUEUE: 'RECEIVED_ERROR_QUEUE',
  RECEIVED_DEAD_LETTER_QUEUE: 'RECEIVED_DEAD_LETTER_QUEUE',
  COMPLETED_SUCCESS: 'COMPLETED_SUCCESS',
  COMPLETED_NO_CHANGES_DETECTED: 'COMPLETED_NO_CHANGES_DETECTED',
  COMPLETED_FAILURE: 'COMPLETED_FAILURE'
};

export const FIELD_NAMES = {
  HOME_PHONE: 'homePhone',
  MOBILE_PHONE: 'mobilePhone',
  WORK_PHONE: 'workPhone',
  TEMP_PHONE: 'temporaryPhone',
  FAX_NUMBER: 'faxNumber',
  EMAIL: 'email',
  MAILING_ADDRESS: 'mailingAddress',
  RESIDENTIAL_ADDRESS: 'residentialAddress'
};

export const PHONE_TYPE = {
  mobilePhone: 'MOBILE',
  workPhone: 'WORK',
  temporaryPhone: 'TEMPORARY',
  faxNumber: 'FAX',
  homePhone: 'HOME',
};

export const ANALYTICS_FIELD_MAP = {
  primaryTelephone: 'primary-telephone',
  alternateTelephone: 'alternative-telephone',
  homePhone: 'home-telephone',
  mobilePhone: 'mobile-telephone',
  workPhone: 'work-telephone',
  faxNumber: 'fax-telephone',
  email: 'email',
  mailingAddress: 'mailing-address',
  residentialAddress: 'home-address'
};
