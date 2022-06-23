import PropTypes from 'prop-types';

export const YOUR_PROFILE_URL = '/profile';

export const RELATIONSHIP = {
  CHILD: 'Child',
  SPOUSE: 'Spouse',
};

export const ELIGIBILITY = {
  CHAPTER_30: 'Chapter30',
  CHAPTER_1606: 'Chapter1606',
};

export const VETERAN_NOT_LISTED_LABEL = 'Someone not listed here';
export const VETERAN_NOT_LISTED_VALUE = 'VETERAN_NOT_LISTED';

export const VETERANS_TYPE = PropTypes.arrayOf(
  PropTypes.shape({
    dateOfBirth: PropTypes.string,
    deaEligibility: PropTypes.number,
    fryEligibility: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    relationship: PropTypes.string,
  }),
);

export const formPages = {
  applicantInformation: 'applicantInformation',
  contactInformation: {
    contactInformation: 'contactInformation',
    mailingAddress: 'mailingAddress',
    preferredContactMethod: 'preferredContactMethod',
  },
  serviceHistory: 'serviceHistory',
  benefitSelection: 'benefitSelection',
  directDeposit: 'directDeposit',
  veteranInformation: 'veteranInformation',
  highSchool: 'highSchool',
  additionalConsiderations: {
    marriageDate: 'marriageDate',
    marriageInformation: {
      divorced: 'divorced',
      annulled: 'annulled',
      widowed: 'widowed',
    },
    remarriage: 'remarriage',
    remarriageDate: 'remarriageDate',
  },
};

export const formFields = {
  accountNumber: 'accountNumber',
  accountType: 'accountType',
  activeDutyKicker: 'activeDutyKicker',
  additionalConsiderationsNote: 'additionalConsiderationsNote',
  address: 'address',
  bankAccount: 'bankAccount',
  benefitSelection: 'benefitSelection',
  contactMethod: 'contactMethod',
  confirmEmail: 'confirmEmail',
  dateOfBirth: 'dateOfBirth',
  email: 'email',
  federallySponsoredAcademy: 'federallySponsoredAcademy',
  selectedVeteran: 'selectedVeteran',
  fullName: 'fullName',
  hasDoDLoanPaymentPeriod: 'hasDoDLoanPaymentPeriod',
  highSchoolDiploma: 'highSchoolDiploma',
  highSchoolDiplomaDate: 'highSchoolDiplomaDate',
  incorrectServiceHistoryExplanation: 'incorrectServiceHistoryExplanation',
  loanPayment: 'loanPayment',
  mobilePhoneNumber: 'mobilePhoneNumber',
  mobilePhoneNumberInternational: 'mobilePhoneNumberInternational',
  phoneNumber: 'phoneNumber',
  phoneNumberInternational: 'phoneNumberInternational',
  relationshipToVeteran: 'relationshipToServiceMember',
  receiveTextMessages: 'receiveTextMessages',
  routingNumber: 'routingNumber',
  serviceHistoryIncorrect: 'serviceHistoryIncorrect',
  veteranDateOfBirth: 'veteranDateOfBirth',
  veteranFullName: 'veteranFullName',
  ssn: 'nsn',
  userFullName: 'userFullName',
  viewBenefitSelection: 'view:benefitSelection',
  viewNoDirectDeposit: 'view:noDirectDeposit',
  viewNoVeteranWarning: 'view:noVeteranWarning',
  viewPhoneNumbers: 'view:phoneNumbers',
  viewStopWarning: 'view:stopWarning',
  additionalConsiderations: {
    marriageDate: 'marriageDate',
    marriageInformation: 'marriageInformation',
    remarriage: 'remarriage',
    remarriageDate: 'remarriageDate',
  },
};
