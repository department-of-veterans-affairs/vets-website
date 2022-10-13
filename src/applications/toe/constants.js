import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

export const LETTER_URL = `${
  environment.API_URL
}/education/download-letters/letters`;

export const SPONSOR_RELATIONSHIP = {
  CHILD: 'Child',
  SPOUSE: 'Spouse',
};
export const SPONSOR_NOT_LISTED_LABEL = 'Someone not listed here';
export const SPONSOR_NOT_LISTED_VALUE = 'SPONSOR_NOT_LISTED';
export const IM_NOT_SURE_LABEL = 'I’m not sure';
export const IM_NOT_SURE_VALUE = 'IM_NOT_SURE';
export const SPONSORS_TYPE = PropTypes.shape({
  sponsors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      date: PropTypes.string,
      relationship: PropTypes.string,
    }),
  ),
  someoneNotListed: PropTypes.bool,
});

export const YOUR_PROFILE_URL = '/profile';

export const formFields = {
  accountNumber: 'accountNumber',
  accountType: 'accountType',
  address: 'address',
  bankAccount: 'bankAccount',
  contactMethod: 'contactMethod',
  confirmEmail: 'confirmEmail',
  dateOfBirth: 'dateOfBirth',
  email: 'email',
  firstSponsor: 'firstSponsor',
  highSchoolDiploma: 'highSchoolDiploma',
  highSchoolDiplomaDate: 'highSchoolDiplomaDate',
  mobilePhoneNumber: 'mobilePhoneNumber',
  mobilePhoneNumberInternational: 'mobilePhoneNumberInternational',
  parentGuardianSponsor: 'parentGuardianSponsor',
  phoneNumber: 'phoneNumber',
  phoneNumberInternational: 'phoneNumberInternational',
  preferredContactMethod: 'preferredContactMethod',
  relationshipToServiceMember: 'relationshipToServiceMember',
  receiveTextMessages: 'receiveTextMessages',
  routingNumber: 'routingNumber',
  selectedSponsors: 'selectedSponsors',
  sponsorDateOfBirth: 'sponsorDateOfBirth',
  sponsorFullName: 'sponsorFullName',
  userFullName: 'userFullName',
  viewPhoneNumbers: 'view:phoneNumbers',
  viewReceiveTextMessages: 'view:receiveTextMessages',
  viewUserFullName: 'view:userFullName',
  viewMailingAddress: 'view:mailingAddress',
};
