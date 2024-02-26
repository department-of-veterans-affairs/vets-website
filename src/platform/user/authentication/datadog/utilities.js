import { datadogLogs } from '@datadog/browser-logs';

const DATA_DOG_TOKEN = 'pube9cdb0054ba0126c0adac86ff8ac50e2';
const DATA_DOG_SERVICE = 'octo-identity';

export const DD_SESSION_STORAGE_KEY = 'dataDogSession';

export const STATUS_TYPE = {
  DEBUG: 'debug',
  ERROR: 'error',
  INFO: 'info',
  WARN: 'warn',
};

export const LOG_NAME = {
  // Login
  LOGIN_ATTEMPT: 'ui:login-attempt',
  LOGIN_SUCCESS: 'ui:login-success',
  LOGIN_FAIL: 'ui:login-fail',
  // Register
  REGISTER_ATTEMPT: 'ui:register-attempt',
  REGISTER_SUCCESS: 'ui:register-success',
  REGISTER_FAILURE: 'ui:register-failure',
  // Verify
  VERIFY_ATTEMPT: 'ui:verify-attempt',
  VERIFY_SUCCESS: 'ui:verify-success',
  VERIFY_FAILURE: 'ui:verify-failure',
  // Logout
  LOGOUT_ATTEMPT: 'ui:logout-attempt',
};

export const EVENT_TYPE = {
  LOGIN: 'login',
  REGISTER: 'register',
  VERIFY: 'verify',
  SIGNOUT: 'signout',
};

export const AUTH_LOCATION = {
  USIP: 'usip',
  MODAL: 'modal', // application must be 'vagov'
};

export const APPLICATION = {
  VAGOV: 'vagov', // default if application isn't defined on USiP, allows SiS or SSOe
  MHV: 'mhv', // SSOe only
  EBENEFITS: 'ebenefits', // SSOe only
  MYVAHEALTH: 'myvahealth', // SSOe only
  VAMOBILE: 'vamobile', // SiS only
  VAOCCMOBILE: 'vaoccmobile', // SSOe only
  ARP: 'arp', // SiS only
};

export const LEVEL = {
  LOA1: 'loa1', // SSOe only
  LOA3: 'loa3', // SSOe only
  MIN: 'min', // SiS only
  IAL2: 'ial2', // SiS only
  UNKNOWN: 'unknown',
};

export const newPayload = ({
  csp,
  authBroker,
  authLocation,
  application,
  level = LEVEL.UNKNOWN,
}) => {
  const payload = { csp, authBroker, authLocation, application, level };
  const requiredFields = ['csp', 'authBroker', 'authLocation', 'application'];
  const missingFields = requiredFields.filter(field => !payload[field]);
  if (missingFields.length > 0) {
    throw new Error(
      `Payload is missing required field(s): ${missingFields.join(', ')}`,
    );
  }
  return payload;
};

export const newError = ({ message, code, requestId }) => {
  const error = {
    message,
    ...(code && { code }),
    ...(requestId && { requestId }),
  };
  if (!message) {
    throw new Error('Error message cannot be left blank');
  }
  return error;
};

export const dataDogLog = ({ name, payload, status, error }) => {
  if (!name) {
    throw new Error('Name cannot be left blank');
  }
  // Initialize datadog logger
  datadogLogs.init({
    clientToken: DATA_DOG_TOKEN,
    forwardErrorsToLogs: true,
    service: DATA_DOG_SERVICE,
    site: 'ddog-gov.com',
  });
  datadogLogs.logger.log(name, payload, status, error);
};
