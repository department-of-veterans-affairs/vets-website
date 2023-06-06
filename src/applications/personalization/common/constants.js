export const LOADING_STATES = Object.freeze({
  idle: 'idle',
  pending: 'pending',
  error: 'error',
  loaded: 'loaded',
});

export const benefitTypes = {
  CNP: 'CNP',
  EDU: 'EDU',
};

export const API_NAMES = Object.freeze({
  PAYMENT_HISTORY: 'paymentHistory',
  CH33_BANK_ACCOUNTS: 'ch33BankAccounts',
  COMMUNICATION_PREFERENCES: 'communicationPreferences',
  CONNECTED_APPS: 'connectedApps',
  MILITARY_HISTORY: 'militaryHistory',
  PERSONAL_INFORMATION: 'personalInformation',
  RATING_INFO: 'ratingInfo',
  APPEALS: 'appeals',
  MEDICAL_COPAYS: 'medicalCopays',
});
