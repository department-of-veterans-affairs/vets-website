// Correspond to those in the API - https://github.com/department-of-veterans-affairs/vets-api/blob/master/lib/backend_services.rb
export default {
  GI_BILL_STATUS: 'gibs',

  FACILITIES: 'facilities',
  HCA: 'hca',
  EDUCATION_BENEFITS: 'edu-benefits',
  EVSS_CLAIMS: 'evss-claims',
  APPEALS_STATUS: 'appeals-status',
  USER_PROFILE: 'user-profile',
  ID_CARD: 'id-card',
  IDENTITY_PROOFED: 'identity-proofed',
  VET360: 'vet360',

  // MHV services
  RX: 'rx',
  MESSAGING: 'messaging',
  HEALTH_RECORDS: 'health-records',
  MHV_AC: 'mhv-accounts',

  // Core Form Features
  SAVE_IN_PROGRESS: 'form-save-in-progress',
  FORM_PREFILL: 'form-prefill',

  // 526 beta
  // If the user is enrolled in the 526 increase form beta
  CLAIM_INCREASE: 'claim_increase',
  // If the 526 increase form is still available for the day/week and
  // hasn't hit the submission limit
  CLAIM_INCREASE_AVAILABLE: 'claim-increase-available',
};
