import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { ENSURE_FIELDS_INITIALIZED, VETERAN_FIELD_UPDATE } from '../../actions';
import { initializeNullValues } from '../../utils/validations';
import { pathToData } from '../../store';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);

// TODO(awong): This structure should reflect a logical data model for a veteran. Currently it
// mirrors the UI stricture too much.

// TODO: Remove providers and children if checkbox within section is unchecked
const blankVeteran = {
  nameAndGeneralInformation: {
    fullName: {
      first: null,
      middle: null,
      last: null,
      suffix: null,
    },
    mothersMaidenName: null,
    socialSecurityNumber: null,
    gender: null,
    dateOfBirth: {
      month: null,
      day: null,
      year: null,
    },
    maritalStatus: null,
    sectionComplete: false
  },

  vaInformation: {
    isVaServiceConnected: null,
    compensableVaServiceConnected: false,
    receivesVaPension: false,
    sectionComplete: false
  },

  additionalInformation: {
    isEssentialAcaCoverage: false,
    facilityState: null,
    vaMedicalFacility: null,
    wantsInitialVaContact: false,
    sectionComplete: false
  },

  demographicInformation: {
    isSpanishHispanicLatino: false,
    isAmericanIndianOrAlaskanNative: false,
    isBlackOrAfricanAmerican: false,
    isNativeHawaiianOrOtherPacificIslander: false,
    isAsian: false,
    isWhite: false,
    sectionComplete: false
  },

  veteranAddress: {
    address: {
      street: null,
      city: null,
      country: null,
      state: null,
      zipcode: null,
    },
    county: null,
    email: null,
    emailConfirmation: null,
    homePhone: null,
    mobilePhone: null,
    sectionComplete: false
  },

  financialDisclosure: {
    provideFinancialInfo: false,
    understandsFinancialDisclosure: false,
    sectionComplete: false
  },

  spouseInformation: {
    spouseFullName: {
      first: null,
      middle: null,
      last: null,
      suffix: null,
    },
    spouseSocialSecurityNumber: null,
    spouseDateOfBirth: {
      month: null,
      day: null,
      year: null,
    },
    dateOfMarriage: {
      month: null,
      day: null,
      year: null
    },
    sameAddress: false,
    cohabitedLastYear: false,
    provideSupportLastYear: false,
    spouseAddress: {
      street: null,
      city: null,
      country: null,
      state: null,
      zipcode: null,
    },
    spousePhone: null,
    sectionComplete: false
  },

  childInformation: {
    hasChildrenToReport: false,
    children: [],
    sectionComplete: false
  },

  annualIncome: {
    veteranGrossIncome: null,
    veteranNetIncome: null,
    veteranOtherIncome: null,
    spouseGrossIncome: null,
    spouseNetIncome: null,
    spouseOtherIncome: null,
    childrenGrossIncome: null,
    childrenNetIncome: null,
    childrenOtherIncome: null,
    sectionComplete: false
  },

  deductibleExpenses: {
    deductibleMedicalExpenses: null,
    deductibleFuneralExpenses: null,
    deductibleEducationExpenses: null,
    sectionComplete: false
  },

  insuranceInformation: {
    isCoveredByHealthInsurance: false,
    providers: [],
    sectionComplete: false
  },

  medicareMedicaid: {
    isMedicaidEligible: false,
    isEnrolledMedicarePartA: false,
    medicarePartAEffectiveDate: {
      month: null,
      day: null,
      year: null
    },
    sectionComplete: false
  },

  serviceInformation: {
    lastServiceBranch: null,
    lastEntryDate: {
      month: null,
      day: null,
      year: null
    },
    lastDischargeDate: {
      month: null,
      day: null,
      year: null
    },
    dischargeType: null,
    sectionComplete: false
  },

  militaryAdditionalInfo: {
    purpleHeartRecipient: false,
    isFormerPow: false,
    postNov111998Combat: false,
    disabledInLineOfDuty: false,
    swAsiaCombat: false,
    vietnamService: false,
    exposedToRadiation: false,
    radiumTreatments: false,
    campLejeune: false,
    sectionComplete: false
  }
};

function veteran(state = blankVeteran, action) {
  let newState = undefined;
  switch (action.type) {
    case VETERAN_FIELD_UPDATE:
      newState = Object.assign({}, state);
      _.set(newState, action.propertyPath, action.value);
      return newState;

    case ENSURE_FIELDS_INITIALIZED:
      newState = Object.assign({}, state);
      // TODO(awong): HACK! Assigning to the sub object assumes pathToData() returns a reference
      // to the actual substructre such that it can be reassigned to.
      Object.assign(pathToData(newState, action.path), initializeNullValues(pathToData(newState, action.path)));
      return newState;

    default:
      return state;
  }
}

export default veteran;
