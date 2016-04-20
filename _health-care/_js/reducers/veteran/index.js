import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { ENSURE_FIELDS_INITIALIZED, VETERAN_FIELD_UPDATE, UPDATE_SPOUSE_ADDRESS } from '../../actions';
import { makeField, dirtyAllFields } from '../fields';
import { pathToData } from '../../store';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);

// TODO(awong): This structure should reflect a logical data model for a veteran. Currently it
// mirrors the UI stricture too much.

// TODO: Remove providers and children if checkbox within section is unchecked
const blankVeteran = {
  nameAndGeneralInformation: {
    fullName: {
      first: makeField(''),
      middle: makeField(''),
      last: makeField(''),
      suffix: makeField(''),
    },
    mothersMaidenName: makeField(''),
    socialSecurityNumber: makeField(''),
    gender: makeField(''),
    dateOfBirth: {
      month: makeField(''),
      day: makeField(''),
      year: makeField(''),
    },
    cityOfBirth: makeField(''),
    stateOfBirth: makeField(''),
    maritalStatus: makeField(''),
    sectionComplete: false
  },

  vaInformation: {
    isVaServiceConnected: null,
    compensableVaServiceConnected: null,
    receivesVaPension: null,
    sectionComplete: false
  },

  additionalInformation: {
    isEssentialAcaCoverage: false,
    facilityState: makeField(''),
    vaMedicalFacility: makeField(''),
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
      street: makeField(''),
      city: makeField(''),
      country: makeField(''),
      state: makeField(''),
      zipcode: makeField(''),
    },
    county: makeField(''),
    email: makeField(''),
    emailConfirmation: makeField(''),
    homePhone: makeField(''),
    mobilePhone: makeField(''),
    sectionComplete: false
  },

  financialDisclosure: {
    provideFinancialInfo: false,
    understandsFinancialDisclosure: false,
    sectionComplete: false
  },

  spouseInformation: {
    spouseFullName: {
      first: makeField(''),
      middle: makeField(''),
      last: makeField(''),
      suffix: makeField(''),
    },
    spouseSocialSecurityNumber: makeField(''),
    spouseDateOfBirth: {
      month: makeField(''),
      day: makeField(''),
      year: makeField(''),
    },
    dateOfMarriage: {
      month: makeField(''),
      day: makeField(''),
      year: makeField('')
    },
    sameAddress: false,
    cohabitedLastYear: false,
    provideSupportLastYear: false,
    spouseAddress: {
      street: makeField(''),
      city: makeField(''),
      country: makeField(''),
      state: makeField(''),
      zipcode: makeField(''),
    },
    spousePhone: makeField(''),
    sectionComplete: false
  },

  childInformation: {
    hasChildrenToReport: false,
    children: [],
    sectionComplete: false
  },

  annualIncome: {
    veteranGrossIncome: makeField(''),
    veteranNetIncome: makeField(''),
    veteranOtherIncome: makeField(''),
    spouseGrossIncome: makeField(''),
    spouseNetIncome: makeField(''),
    spouseOtherIncome: makeField(''),
    childrenGrossIncome: makeField(''),
    childrenNetIncome: makeField(''),
    childrenOtherIncome: makeField(''),
    sectionComplete: false
  },

  deductibleExpenses: {
    deductibleMedicalExpenses: makeField(''),
    deductibleFuneralExpenses: makeField(''),
    deductibleEducationExpenses: makeField(''),
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
      month: makeField(''),
      day: makeField(''),
      year: makeField('')
    },
    sectionComplete: false
  },

  serviceInformation: {
    lastServiceBranch: makeField(''),
    lastEntryDate: {
      month: makeField(''),
      day: makeField(''),
      year: makeField('')
    },
    lastDischargeDate: {
      month: makeField(''),
      day: makeField(''),
      year: makeField('')
    },
    dischargeType: makeField(''),
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
    case VETERAN_FIELD_UPDATE: {
      newState = Object.assign({}, state);
      _.set(newState, action.propertyPath, action.value);
      return newState;
    }

    case ENSURE_FIELDS_INITIALIZED: {
      newState = Object.assign({}, state);
      // TODO(awong): HACK! Assigning to the sub object assumes pathToData() returns a reference
      // to the actual substructre such that it can be reassigned to.
      Object.assign(pathToData(newState, action.path), dirtyAllFields(pathToData(newState, action.path)));
      return newState;
    }

    // Copies the veteran's address into the spouse's address fields if they have the same address.
    // Clears the spouse's address fields if they do not.
    case UPDATE_SPOUSE_ADDRESS: {
      newState = Object.assign({}, state);
      const emptyAddress = {
        street: null,
        city: null,
        country: null,
        state: null,
        zipcode: null,
      };
      if (action.value) {
        _.set(newState, action.propertyPath, state.veteranAddress.address);
      } else {
        _.set(newState, action.propertyPath, emptyAddress);
      }
      return newState;
    }

    default:
      return state;
  }
}

export default veteran;

