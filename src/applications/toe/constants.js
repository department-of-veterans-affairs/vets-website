import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

export const LETTER_URL = `${
  environment.API_URL
}/education/download-letters/letters`;

export const LETTER_ENDPOINT = `${environment.API_URL}/meb_api/v0/claim_letter`;

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

export const START_APPLICATION_TEXT = 'Start your benefit application';

export const YOUR_PROFILE_URL = '/profile';

export const CHANGE_YOUR_NAME =
  'https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/';

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
  highSchoolDiplomaLegacy: 'highSchoolDiplomaLegacy',
  highSchoolDiplomaDateLegacy: 'highSchoolDiplomaDateLegacy',
  mobilePhoneNumber: 'mobilePhoneNumber',
  mobilePhoneNumberInternational: 'mobilePhoneNumberInternational',
  originalAccountNumber: 'originalAccountNumber',
  originalRoutingNumber: 'originalRoutingNumber',
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
