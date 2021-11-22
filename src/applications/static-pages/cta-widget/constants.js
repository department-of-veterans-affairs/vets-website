export const MHV_ACCOUNT_TYPES = ['Premium', 'Advanced', 'Basic'];

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

export const ACCOUNT_STATES_SET = new Set(Object.values(ACCOUNT_STATES));
