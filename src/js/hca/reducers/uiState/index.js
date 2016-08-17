import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { UPDATE_COMPLETED_STATUS, UPDATE_INCOMPLETE_STATUS, UPDATE_REVIEW_STATUS, UPDATE_VERIFIED_STATUS, UPDATE_SUBMISSION_STATUS, UPDATE_SUBMISSION_ID, UPDATE_SUBMISSION_TIMESTAMP } from '../../actions';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);


const ui = {
  submission: {
    status: false,
    errorMessage: false,
    id: false,
    timestamp: false
  },
  sections: {
    '/introduction': {
      complete: false,
      verified: false,
      fields: []
    },
    '/veteran-information/personal-information': {
      complete: false,
      verified: false,
      fields: ['veteranFullName', 'mothersMaidenName']
    },
    '/veteran-information/birth-information': {
      complete: false,
      verified: false,
      fields: ['veteranSocialSecurityNumber', 'veteranDateOfBirth', 'cityOfBirth', 'stateOfBirth']
    },
    '/veteran-information/demographic-information': {
      complete: false,
      verified: false,
      fields: ['gender', 'isSpanishHispanicLatino', 'isAmericanIndianOrAlaskanNative', 'isBlackOrAfricanAmerican', 'isNativeHawaiianOrOtherPacificIslander', 'isAsian', 'isWhite']
    },
    '/veteran-information/veteran-address': {
      complete: false,
      verified: false,
      fields: ['veteranAddress']
    },
    '/veteran-information/contact-information': {
      complete: false,
      verified: false,
      fields: ['email', 'emailConfirmation', 'homePhone', 'mobilePhone']
    },
    '/military-service/service-information': {
      complete: false,
      verified: false,
      fields: ['lastServiceBranch', 'lastEntryDate', 'lastDischargeDate', 'dischargeType']
    },
    '/military-service/additional-information': {
      complete: false,
      verified: false,
      fields: ['purpleHeartRecipient', 'isFormerPow', 'postNov111998Combat', 'disabledInLineOfDuty', 'swAsiaCombat', 'vietnamService', 'exposedToRadiation', 'radiumTreatments', 'campLejeune']
    },
    '/va-benefits/basic-information': {
      complete: false,
      verified: false,
      fields: ['isVaServiceConnected', 'compensableVaServiceConnected', 'receivesVaPension']
    },
    '/household-information/financial-disclosure': {
      complete: false,
      verified: false,
      fields: ['understandsFinancialDisclosure']
    },
    '/household-information/spouse-information': {
      complete: false,
      verified: false,
      fields: ['maritalStatus', 'spouseFullName', 'spouseSocialSecurityNumber', 'spouseDateOfBirth', 'dateOfMarriage', 'sameAddress', 'cohabitedLastYear', 'provideSupportLastYear', 'spouseAddress', 'spousePhone']
    },
    '/household-information/child-information': {
      complete: false,
      verified: false,
      fields: ['hasChildrenToReport', 'children']
    },
    '/household-information/annual-income': {
      complete: false,
      verified: false,
      fields: ['veteranGrossIncome', 'veteranNetIncome', 'veteranOtherIncome', 'spouseGrossIncome', 'spouseNetIncome', 'spouseOtherIncome', 'children']
    },
    '/household-information/deductible-expenses': {
      complete: false,
      verified: false,
      fields: ['deductibleMedicalExpenses', 'deductibleFuneralExpenses', 'deductibleEducationExpenses']
    },
    '/insurance-information/medicare': {
      complete: false,
      verified: false,
      fields: ['isMedicaidEligible', 'isEnrolledMedicarePartA', 'medicarePartAEffectiveDate']
    },
    '/insurance-information/general': {
      complete: false,
      verified: false,
      fields: ['isCoveredByHealthInsurance', 'providers']
    },
    '/insurance-information/va-facility': {
      complete: false,
      verified: false,
      fields: ['isEssentialAcaCoverage', 'facilityState', 'vaMedicalFacility', 'wantsInitialVaContact']
    },
    '/review-and-submit': {
      complete: false,
      verified: false,
      fields: []
    }
  }
};

function uiState(state = ui, action) {
  let newState = undefined;
  switch (action.type) {
    case UPDATE_COMPLETED_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.sections, [action.path, 'complete'], true);
      return newState;

    case UPDATE_INCOMPLETE_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.sections, [action.path, 'complete'], false);
      return newState;

    case UPDATE_REVIEW_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.sections, [action.path, 'complete'], action.value);
      return newState;

    case UPDATE_VERIFIED_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.sections, [action.path, 'verified'], action.value);
      return newState;

    case UPDATE_SUBMISSION_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.submission, 'status', action.value);
      return newState;

    case UPDATE_SUBMISSION_ID:
      newState = Object.assign({}, state);
      _.set(newState.submission, 'id', action.value);
      return newState;

    case UPDATE_SUBMISSION_TIMESTAMP:
      newState = Object.assign({}, state);
      _.set(newState.submission, 'timestamp', action.value);
      return newState;

    default:
      return state;
  }
}

export default uiState;
