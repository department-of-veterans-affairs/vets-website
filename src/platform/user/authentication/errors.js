export const SENTRY_TAGS = {
  LOGIN_TYPE: 'loginType',
  ERROR_CODE: 'loginErrorCode',
  REQUEST_ID: 'loginRequestId',
};

export const AUTH_LEVEL = { FAIL: 'fail', SUCCESS: 'success' };

export const AUTH_ERRORS = {
  USER_DENIED: {
    errorCode: '001',
    message: `User clicked 'Deny' in Authorization`,
  },
  USER_CLOCK_MISMATCH: {
    errorCode: '002',
    message: `User system time is incorrect`,
  },
  SERVER_CLOCK_MISMATCH: {
    errorCode: '003',
    message: `API Server time is incorrect`,
  },
  MVI_MISMATCH: {
    errorCode: '004',
    message: `MPI Mismatch`,
  },
  SESSION_EXPIRED: {
    errorCode: '005',
    message: `Session Expired`,
  },
  DEFAULT: {
    errorCode: '007',
    message: `Unknown Error`,
  },
  LOGINGOV_PROOFING_FAIL: {
    errorCode: '009',
    message: `Login.gov Failure to Proof`,
  },
  MULTIPLE_MHVIDS: {
    errorCode: '101',
    message: `Multiple MHV IDs/IENs Found`,
  },
  MULTIPLE_EDIPIS: {
    errorCode: '102',
    message: `Multiple EDIPIS`,
  },
  ICN_MISMATCH: {
    errorCode: '103',
    message: `ICN Mismatch`,
  },
  UUID_MISSING: {
    errorCode: '104',
    message: `UUID Missing (Login.gov or ID.me)`,
  },
  MULTIPLE_CORPIDS: {
    errorCode: '106',
    message: `Multiple Corp IDs`,
  },
  MHV_VERIFICATION_ERROR: {
    errorCode: '108',
    message: `MHV Verification Error`,
  },
  CERNER_PROVISIONING_FAILURE: {
    errorCode: '110',
    message: `We're having trouble provisioning your My VA Health account right now.`,
  },
  OAUTH_DEFAULT_ERROR: {
    errorCode: '201',
    message: `Unknown OAuth Error`,
  },
  OAUTH_STATE_MISMATCH: {
    errorCode: '202',
    message: `OAuth State Mismatch`,
  },
  OAUTH_INVALID_REQUEST: {
    errorCode: '203',
    message: `OAuth Invalid Request`,
  },
  GENERIC: {
    errorCode: '400',
    message: `OAuth Prelogin Error`,
  },
};

export const getAuthError = code => {
  return (
    Object.values(AUTH_ERRORS).find(c => c.errorCode === code) ??
    AUTH_ERRORS.DEFAULT
  );
};
