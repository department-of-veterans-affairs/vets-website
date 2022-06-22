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
export const VETERAN_NOT_LISTED_VALUE = 'SPONSOR_NOT_LISTED';

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
  firstSponsorSelection: 'firstSponsorSelection',
  sponsorInformation: 'sponsorInformation',
  sponsorHighSchool: 'sponsorHighSchool',
  sponsorSelection: 'sponsorSelection',
  sponsorSelectionReview: 'sponsorSelectionReview',
  verifyHighSchool: 'verifyHighSchool',
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
  parentGuardianSponsor: 'parentGuardianSponsor',
  phoneNumber: 'phoneNumber',
  phoneNumberInternational: 'phoneNumberInternational',
  relationshipToServiceMember: 'relationshipToServiceMember',
  receiveTextMessages: 'receiveTextMessages',
  routingNumber: 'routingNumber',
  serviceHistoryIncorrect: 'serviceHistoryIncorrect',
  selectedSponsors: 'selectedSponsors',
  sponsorDateOfBirth: 'sponsorDateOfBirth',
  sponsorFullName: 'sponsorFullName',
  ssn: 'nsn',
  userFullName: 'userFullName',
  viewBenefitSelection: 'view:benefitSelection',
  viewNoDirectDeposit: 'view:noDirectDeposit',
  viewPhoneNumbers: 'view:phoneNumbers',
  viewSelectedSponsor: 'view:selectedSponsor',
  viewStopWarning: 'view:stopWarning',
  additionalConsiderations: {
    marriageDate: 'marriageDate',
    marriageInformation: 'marriageInformation',
    remarriage: 'remarriage',
    remarriageDate: 'remarriageDate',
  },
};
