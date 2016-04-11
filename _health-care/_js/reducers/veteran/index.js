import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { ENSURE_FIELDS_INITIALIZED, VETERAN_FIELD_UPDATE, UPDATE_SPOUSE_ADDRESS, ENSURE_CHILD_FIELDS_INITIALIZED } from '../../actions';
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
    maritalStatus: null
  },

  vaInformation: {
    isVaServiceConnected: null,
    compensableVaServiceConnected: null,
    receivesVaPension: null
  },

  additionalInformation: {
    isEssentialAcaCoverage: false,
    facilityState: null,
    vaMedicalFacility: null,
    wantsInitialVaContact: false
  },

  demographicInformation: {
    isSpanishHispanicLatino: false,
    isAmericanIndianOrAlaskanNative: false,
    isBlackOrAfricanAmerican: false,
    isNativeHawaiianOrOtherPacificIslander: false,
    isAsian: false,
    isWhite: false
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
    mobilePhone: null
  },

  financialDisclosure: {
    provideFinancialInfo: false,
    understandsFinancialDisclosure: false
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
    spousePhone: null
  },

  childInformation: {
    hasChildrenToReport: false,
    children: []
  },

  annualIncome: {
    veteranGrossIncome: null,
    veteranNetIncome: null,
    veteranOtherIncome: null,
    spouseGrossIncome: null,
    spouseNetIncome: null,
    spouseOtherIncome: null,
    children: []
  },

  deductibleExpenses: {
    deductibleMedicalExpenses: null,
    deductibleFuneralExpenses: null,
    deductibleEducationExpenses: null
  },

  insuranceInformation: {
    isCoveredByHealthInsurance: false,
    providers: []
  },

  medicareMedicaid: {
    isMedicaidEligible: false,
    isEnrolledMedicarePartA: false,
    medicarePartAEffectiveDate: {
      month: null,
      day: null,
      year: null
    }
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
    dischargeType: null
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
    campLejeune: false
  }
};

function createBlankChild() {
  return {
    childShortName: null,
    childGrossIncome: null,
    childNetIncome: null,
    childOtherIncome: null
  };
}

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
      Object.assign(pathToData(newState, action.path), initializeNullValues(pathToData(newState, action.path)));
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

    case ENSURE_CHILD_FIELDS_INITIALIZED:
      newState = Object.assign({}, state);
      // update children income from children info
      newState.annualIncome.children.splice(newState.childInformation.children.length);
      for (let i = 0; i < newState.childInformation.children.length; i++) {
        const shortName = `${newState.childInformation.children[i].childFullName.first} ${newState.childInformation.children[i].childFullName.last}`;
        if (newState.annualIncome.children[i] === undefined) {
          newState.annualIncome.children[i] = createBlankChild();
        }
        newState.annualIncome.children[i].childShortName = shortName;
      }
      Object.assign(pathToData(newState, action.path), initializeNullValues(pathToData(newState, action.path)));
      return newState;

    default:
      return state;
  }
}

export default veteran;

