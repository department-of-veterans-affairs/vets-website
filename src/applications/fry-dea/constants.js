import PropTypes from 'prop-types';

export const YOUR_PROFILE_URL = '/profile';

export const RELATIONSHIP = {
  CHILD: 'Child',
  SPOUSE: 'Spouse',
};

export const ELIGIBILITY = {
  FRY: 'fry',
  DEA: 'dea',
};

export const VETERAN_NOT_LISTED_LABEL = 'Someone not listed here';
export const VETERAN_NOT_LISTED_VALUE = 'VETERAN_NOT_LISTED';
export const VETERAN_VALUE_PREFIX = 'veteran-';

export const VETERANS_TYPE = PropTypes.arrayOf(
  PropTypes.shape({
    dateOfBirth: PropTypes.string,
    deaEligibility: PropTypes.bool,
    deaStartDate: PropTypes.string,
    fryEligibility: PropTypes.bool,
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
  phoneNumber: 'phoneNumber',
  phoneNumberInternational: 'phoneNumberInternational',
  relationshipToVeteran: 'relationshipToVeteran',
  receiveTextMessages: 'receiveTextMessages',
  routingNumber: 'routingNumber',
  selectedVeteran: 'selectedVeteran',
  veteranDateOfBirth: 'veteranDateOfBirth',
  veteranFullName: 'veteranFullName',
  userFullName: 'userFullName',
  viewMailingAddress: 'view:mailingAddress',
  viewPhoneNumbers: 'view:phoneNumbers',
  viewReceiveTextMessages: 'view:receiveTextMessages',
};
