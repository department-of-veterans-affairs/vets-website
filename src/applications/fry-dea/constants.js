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
    deaStartDate: PropTypes.string,
    fryEligibility: PropTypes.number,
    fryStartDate: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    relationship: PropTypes.string,
  }),
);

export const formFields = {
  accountNumber: 'accountNumber',
  accountType: 'accountType',
  additionalConsiderations: {
    marriageDate: 'marriageDate',
    marriageInformation: 'marriageInformation',
    outstandingFelony: 'outstandingFelony',
    remarriage: 'remarriage',
    remarriageDate: 'remarriageDate',
  },
  address: 'address',
  bankAccount: 'bankAccount',
  benefitSelection: 'benefitSelection',
  contactMethod: 'contactMethod',
  confirmEmail: 'confirmEmail',
  dateOfBirth: 'dateOfBirth',
  email: 'email',
  fullName: 'fullName',
  highSchoolDiploma: 'highSchoolDiploma',
  highSchoolDiplomaDate: 'highSchoolDiplomaDate',
  mobilePhoneNumber: 'mobilePhoneNumber',
  mobilePhoneNumberInternational: 'mobilePhoneNumberInternational',
  phoneNumber: 'phoneNumber',
  phoneNumberInternational: 'phoneNumberInternational',
  relationshipToVeteran: 'relationshipToServiceMember',
  receiveTextMessages: 'receiveTextMessages',
  routingNumber: 'routingNumber',
  selectedVeteran: 'selectedVeteran',
  veteranDateOfBirth: 'veteranDateOfBirth',
  veteranFullName: 'veteranFullName',
  userFullName: 'userFullName',
  viewPhoneNumbers: 'view:phoneNumbers',
};
