import PropTypes from 'prop-types';

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

export const newFormFields = {
  newAccountNumber: 'newAccountNumber',
  newAccountType: 'newAccountType',
  newActiveDutyKicker: 'newActiveDutyKicker',
  newAdditionalConsiderationsNote: 'newAdditionalConsiderationsNote',
  newAddress: 'newAddress',
  newBankAccount: 'newBankAccount',
  newContactMethod: 'newContactMethod',
  newConfirmEmail: 'newConfirmEmail',
  newDateOfBirth: 'newDateOfBirth',
  newEmail: 'newEmail',
  newFederallySponsoredAcademy: 'newFederallySponsoredAcademy',
  firstSponsor: 'firstSponsor',
  newFullName: 'newFullName',
  newHasDoDLoanPaymentPeriod: 'newHasDoDLoanPaymentPeriod',
  newHighSchoolDiploma: 'newHighSchoolDiploma',
  newHighSchoolDiplomaDate: 'newHighSchoolDiplomaDate',
  newIncorrectServiceHistoryExplanation:
    'newIncorrectServiceHistoryExplanation',
  newLoanPayment: 'newLoanPayment',
  newMobilePhoneNumber: 'newMobilePhoneNumber',
  newMobilePhoneNumberInternational: 'newMobilePhoneNumberInternational',
  newParentGuardianSponsor: 'newParentGuardianSponsor',
  newPhoneNumber: 'newPhoneNumber',
  newPhoneNumberInternational: 'newPhoneNumberInternational',
  newRelationshipToServiceMember: 'newRelationshipToServiceMember',
  newReceiveTextMessages: 'newReceiveTextMessages',
  newRoutingNumber: 'newRoutingNumber',
  newServiceHistoryIncorrect: 'newServiceHistoryIncorrect',
  selectedSponsors: 'selectedSponsors',
  newSponsorDateOfBirth: 'newSponsorDateOfBirth',
  newSponsorFullName: 'newSponsorFullName',
  newSsn: 'newSsn',
  newToursOfDuty: 'newToursOfDuty',
  newUserFullName: 'newUserFullName',
  newViewBenefitSelection: 'view:newBenefitSelection',
  newViewNoDirectDeposit: 'view:newNoDirectDeposit',
  newViewPhoneNumbers: 'view:newPhoneNumbers',
  newViewSelectedSponsor: 'view:newSelectedSponsor',
  newViewStopWarning: 'view:newStopWarning',
};
