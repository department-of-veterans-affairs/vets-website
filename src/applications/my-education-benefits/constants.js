import environment from 'platform/utilities/environment';

export const CHANGE_YOUR_NAME =
  'https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/';
export const DATE_TIMESTAMP = 'YYYY-MM-DD';
export const FORMAT_DATE_READABLE = 'MMMM DD, YYYY';
export const LETTER_URL = `${environment.API_URL}/meb_api/v0/claim_letter`;
export const YOUR_PROFILE_URL = '/profile';
export const formFields = {
  accountNumber: 'accountNumber',
  accountType: 'accountType',
  activeDutyKicker: 'activeDutyKicker',
  additionalConsiderationsNote: 'additionalConsiderationsNote',
  address: 'address',
  bankAccount: 'bankAccount',
  benefitEffectiveDate: 'benefitEffectiveDate',
  benefitRelinquished: 'benefitRelinquished',
  claimantId: 'claimantId',
  contactMethod: 'contactMethod',
  dateOfBirth: 'dateOfBirth',
  email: 'email',
  federallySponsoredAcademy: 'federallySponsoredAcademy',
  formId: 'formId',
  fullName: 'fullName',
  hasDoDLoanPaymentPeriod: 'hasDoDLoanPaymentPeriod',
  incorrectServiceHistoryExplanation: 'incorrectServiceHistoryExplanation',
  livesOnMilitaryBase: 'livesOnMilitaryBase',
  loanPayment: 'loanPayment',
  mobilePhoneNumber: 'mobilePhoneNumber',
  originalAccountNumber: 'originalAccountNumber',
  originalRoutingNumber: 'originalRoutingNumber',
  phoneNumber: 'phoneNumber',
  receiveTextMessages: 'receiveTextMessages',
  routingNumber: 'routingNumber',
  selectedReserveKicker: 'selectedReserveKicker',
  seniorRotcCommission: 'seniorRotcCommission',
  serviceHistoryIncorrect: 'serviceHistoryIncorrect',
  toursOfDuty: 'toursOfDuty',
  userFullName: 'userFullName',
  viewBenefitSelection: 'view:benefitSelection',
  viewMailingAddress: 'view:mailingAddress',
  viewDirectDeposit: 'view:directDeposit',
  viewPhoneNumbers: 'view:phoneNumbers',
  viewReceiveTextMessages: 'view:receiveTextMessages',
  viewStopWarning: 'view:stopWarning',
  viewUserFullName: 'view:userFullName',
};
