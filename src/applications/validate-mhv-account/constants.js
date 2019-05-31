export const ACCOUNT_STATES = {
  NEEDS_VERIFICATION: 'needs_identity_verification',
  DEACTIVATED_MHV_IDS: 'has_deactivated_mhv_ids',
  MULTIPLE_IDS: 'has_multiple_active_mhv_ids',
  NEEDS_SSN_RESOLUTION: 'needs_ssn_resolution',
  REGISTER_FAILED: 'register_failed',
  UPGRADE_FAILED: 'upgrade_failed',
  NEEDS_VA_PATIENT: 'needs_va_patient',
  NEEDS_TERMS_ACCEPTANCE: 'needs_terms_acceptance',
};

export const ACCOUNT_STATES_ARRAY = [];

Object.keys(ACCOUNT_STATES).forEach(key => {
  ACCOUNT_STATES_ARRAY.push(ACCOUNT_STATES[key]);
});

export const MHV_ACCOUNT_LEVELS = {
  BASIC: 'Basic',
  ADVANCED: 'Advanced',
  PREMIUM: 'Premium',
};

export const MHV_URL = 'https://www.myhealth.va.gov/mhv-portal-web/home';
