'use strict';  // eslint-disable-line
// Veteran resource prototype objects. In common so server unittests can access.

const _ = require('lodash');
const fields = require('./fields');
const makeField = fields.makeField;

// TODO: Remove providers and children if checkbox within section is unchecked
const blankVeteran = {
  veteranFullName: {
    first: makeField(''),
    middle: makeField(''),
    last: makeField(''),
    suffix: makeField(''),
  },
  mothersMaidenName: makeField(''),
  veteranSocialSecurityNumber: makeField(''),
  gender: makeField(''),
  cityOfBirth: makeField(''),
  stateOfBirth: makeField(''),
  veteranDateOfBirth: {
    month: makeField(''),
    day: makeField(''),
    year: makeField(''),
  },
  maritalStatus: makeField(''),

  isVaServiceConnected: makeField(''),
  compensableVaServiceConnected: makeField(''),  // TODO(awong): Ignored by ES System
  receivesVaPension: makeField(''),  // TODO(awong): Ignored by ES System

  isEssentialAcaCoverage: false,
  facilityState: makeField(''),  // TODO(awong): Ignored by ES System
  vaMedicalFacility: makeField(''),
  wantsInitialVaContact: makeField(''),

  isSpanishHispanicLatino: false,
  isAmericanIndianOrAlaskanNative: false,
  isBlackOrAfricanAmerican: false,
  isNativeHawaiianOrOtherPacificIslander: false,
  isAsian: false,
  isWhite: false,

  veteranAddress: {
    street: makeField(''),
    street2: makeField(''),
    street3: makeField(''),
    city: makeField(''),
    country: makeField(''),
    state: makeField(''),
    provinceCode: makeField(''),
    zipcode: makeField(''),
    postalCode: makeField(''),
  },
  email: makeField(''),
  emailConfirmation: makeField(''),  // TODO(awong): Ignored by ES System
  homePhone: makeField(''),
  mobilePhone: makeField(''),

  discloseFinancialInformation: makeField(''),

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
  sameAddress: makeField(''),  // TODO(awong): Not sure how to handle the mapping.
  cohabitedLastYear: makeField(''),  // TODO(awong): This name should be scoped to spouse.
  provideSupportLastYear: makeField(''),  // TODO(awong): This name should be scoped to spouse.
  spouseAddress: {
    street: makeField(''),
    street2: makeField(''),
    street3: makeField(''),
    city: makeField(''),
    country: makeField(''),
    state: makeField(''),
    provinceCode: makeField(''),
    zipcode: makeField(''),
    postalCode: makeField(''),
  },
  spousePhone: makeField(''),

  hasChildrenToReport: makeField(''),
  children: [],

  veteranGrossIncome: makeField(''),
  veteranNetIncome: makeField(''),
  veteranOtherIncome: makeField(''),
  spouseGrossIncome: makeField(''),
  spouseNetIncome: makeField(''),
  spouseOtherIncome: makeField(''),

  deductibleMedicalExpenses: makeField(''),
  deductibleFuneralExpenses: makeField(''),
  deductibleEducationExpenses: makeField(''),

  isCoveredByHealthInsurance: makeField(''),  // TODO(awong): Ignored by ES System
  providers: [],

  isMedicaidEligible: makeField(''),
  isEnrolledMedicarePartA: makeField(''),
  medicarePartAEffectiveDate: {
    month: makeField(''),
    day: makeField(''),
    year: makeField('')
  },

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

  purpleHeartRecipient: false,
  isFormerPow: false,
  postNov111998Combat: false,  // TODO(awong): Verify against e-mail.
  disabledInLineOfDuty: false,  // TODO(awong): Verify against e-mail.
  swAsiaCombat: false,
  vietnamService: false,
  exposedToRadiation: false,
  radiumTreatments: false,
  campLejeune: false,
  privacyAgreementAccepted: false
};

const completeVeteran = {
  veteranFullName: {
    first: {
      value: 'FirstName',
      dirty: true
    },
    middle: {
      value: 'MiddleName',
      dirty: true
    },
    last: {
      value: 'ZZTEST',
      dirty: true
    },
    suffix: {
      value: 'Jr.',
      dirty: true
    }
  },
  mothersMaidenName: {
    value: 'Maiden',
    dirty: true
  },
  veteranSocialSecurityNumber: {
    value: '111-11-1234',
    dirty: true
  },
  gender: {
    value: 'F',
    dirty: true
  },
  cityOfBirth: {
    value: 'Springfield',
    dirty: true
  },
  stateOfBirth: {
    value: 'AK',
    dirty: true
  },
  veteranDateOfBirth: {
    month: {
      value: '1',
      dirty: true
    },
    day: {
      value: '2',
      dirty: true
    },
    year: {
      value: '1923',
      dirty: true
    }
  },
  maritalStatus: {
    value: 'Married',
    dirty: false
  },
  isVaServiceConnected: {
    value: 'N',
    dirty: true
  },
  compensableVaServiceConnected: {
    value: 'N',
    dirty: true
  },
  receivesVaPension: {
    value: 'Y',
    dirty: true
  },
  isEssentialAcaCoverage: true,
  facilityState: {
    value: 'CT',
    dirty: true
  },
  vaMedicalFacility: {
    value: '689A4',
    dirty: true
  },
  wantsInitialVaContact: {
    value: 'Y',
    dirty: true
  },
  isSpanishHispanicLatino: true,
  isAmericanIndianOrAlaskanNative: true,
  isBlackOrAfricanAmerican: true,
  isNativeHawaiianOrOtherPacificIslander: true,
  isAsian: true,
  isWhite: true,
  veteranAddress: {
    street: {
      value: '123 NW 5th St',
      dirty: false
    },
    street2: {
      value: '',
      dirty: false
    },
    street3: {
      value: '',
      dirty: false
    },
    city: {
      value: 'Ontario',
      dirty: false
    },
    country: {
      value: 'CAN',
      dirty: false
    },
    state: {
      value: 'ON',
      dirty: false
    },
    provinceCode: {
      value: 'ProvinceName',
      dirty: false
    },
    zipcode: {
      value: '21231',
      dirty: false
    },
    postalCode: {
      value: '13AA',
      dirty: false
    }
  },
  email: {
    value: 'foo@example.com',
    dirty: false
  },
  emailConfirmation: {
    value: 'foo@example.com',
    dirty: false
  },
  homePhone: {
    value: '1231241234',
    dirty: false
  },
  mobilePhone: {
    value: '1235551234',
    dirty: false
  },
  discloseFinancialInformation: {
    value: 'Y',
    dirty: false
  },
  spouseFullName: {
    first: {
      value: 'FirstSpouse',
      dirty: true
    },
    middle: {
      value: 'MiddleSpouse',
      dirty: true
    },
    last: {
      value: 'LastSpouse',
      dirty: true
    },
    suffix: {
      value: 'Sr.',
      dirty: true
    }
  },
  spouseSocialSecurityNumber: {
    value: '111-22-1234',
    dirty: true
  },
  spouseDateOfBirth: {
    month: {
      value: '4',
      dirty: true
    },
    day: {
      value: '6',
      dirty: true
    },
    year: {
      value: '1980',
      dirty: true
    }
  },
  dateOfMarriage: {
    month: {
      value: '5',
      dirty: true
    },
    day: {
      value: '10',
      dirty: true
    },
    year: {
      value: '1983',
      dirty: true
    }
  },
  sameAddress: {
    value: 'Y',
    dirty: true
  },
  cohabitedLastYear: {
    value: 'Y',
    dirty: true
  },
  provideSupportLastYear: {
    value: 'N',
    dirty: true
  },
  spouseAddress: {
    street: {
      value: '123 NW 8th St',
      dirty: false
    },
    street2: {
      value: '',
      dirty: false
    },
    street3: {
      value: '',
      dirty: false
    },
    city: {
      value: 'Dulles',
      dirty: false
    },
    country: {
      value: 'USA',
      dirty: false
    },
    state: {
      value: 'VA',
      dirty: false
    },
    provinceCode: {
      value: 'ProvinceName',
      dirty: false
    },
    zipcode: {
      value: '20101-0101',
      dirty: false
    },
    postalCode: {
      value: '13AA',
      dirty: false
    }
  },
  spousePhone: {
    value: '1112221234',
    dirty: false
  },
  hasChildrenToReport: {
    value: 'Y',
    dirty: false
  },
  children: [
    {
      childFullName: {
        first: {
          value: 'FirstChildA',
          dirty: true
        },
        middle: {
          value: 'MiddleChildA',
          dirty: true
        },
        last: {
          value: 'LastChildA',
          dirty: true
        },
        suffix: {
          value: 'Jr.',
          dirty: true
        }
      },
      childRelation: {
        value: 'Stepson',
        dirty: true
      },
      childSocialSecurityNumber: {
        value: '111-22-9876',
        dirty: true
      },
      childBecameDependent: {
        month: {
          value: '4',
          dirty: true
        },
        day: {
          value: '7',
          dirty: true
        },
        year: {
          value: '1992',
          dirty: true
        }
      },
      childDateOfBirth: {
        month: {
          value: '5',
          dirty: true
        },
        day: {
          value: '5',
          dirty: true
        },
        year: {
          value: '1982',
          dirty: true
        }
      },
      childDisabledBefore18: {
        value: 'Y',
        dirty: true
      },
      childAttendedSchoolLastYear: {
        value: 'Y',
        dirty: true
      },
      childEducationExpenses: {
        value: '45.2',
        dirty: true
      },
      childCohabitedLastYear: {
        value: 'Y',
        dirty: true
      },
      childReceivedSupportLastYear: {
        value: 'N',
        dirty: true
      },
      grossIncome: {
        value: '991.9',
        dirty: true
      },
      netIncome: {
        value: '981.2',
        dirty: true
      },
      otherIncome: {
        value: '91.9',
        dirty: true
      }
    },
    {
      childFullName: {
        first: {
          value: 'FirstChildB',
          dirty: true
        },
        middle: {
          value: 'MiddleChildB',
          dirty: true
        },
        last: {
          value: 'LastChildB',
          dirty: true
        },
        suffix: {
          value: 'Sr.',
          dirty: true
        }
      },
      childRelation: {
        value: 'Stepdaughter',
        dirty: true
      },
      childSocialSecurityNumber: {
        value: '222111234',
        dirty: true
      },
      childBecameDependent: {
        month: {
          value: '4',
          dirty: true
        },
        day: {
          value: '7',
          dirty: true
        },
        year: {
          value: '2003',
          dirty: true
        }
      },
      childDateOfBirth: {
        month: {
          value: '3',
          dirty: true
        },
        day: {
          value: '7',
          dirty: true
        },
        year: {
          value: '1996',
          dirty: true
        }
      },
      childDisabledBefore18: {
        value: 'N',
        dirty: true
      },
      childAttendedSchoolLastYear: {
        value: 'Y',
        dirty: true
      },
      childEducationExpenses: {
        value: '1198.11',
        dirty: true
      },
      childCohabitedLastYear: {
        value: 'N',
        dirty: true
      },
      childReceivedSupportLastYear: {
        value: 'Y',
        dirty: true
      },
      grossIncome: {
        value: '791.9',
        dirty: true
      },
      netIncome: {
        value: '781.2',
        dirty: true
      },
      otherIncome: {
        value: '71.9',
        dirty: true
      }
    }
  ],
  veteranGrossIncome: {
    value: '123.33',
    dirty: true
  },
  veteranNetIncome: {
    value: '90.11',
    dirty: true
  },
  veteranOtherIncome: {
    value: '10.1',
    dirty: true
  },
  spouseGrossIncome: {
    value: '64.1',
    dirty: true
  },
  spouseNetIncome: {
    value: '35.1',
    dirty: true
  },
  spouseOtherIncome: {
    value: '12.3',
    dirty: true
  },
  deductibleMedicalExpenses: {
    value: '33.3',
    dirty: true
  },
  deductibleFuneralExpenses: {
    value: '44.44',
    dirty: true
  },
  deductibleEducationExpenses: {
    value: '77.77',
    dirty: true
  },
  isCoveredByHealthInsurance: {
    value: 'Y',
    dirty: true
  },
  providers: [
    {
      insuranceName: {
        value: 'MyInsruance',
        dirty: true
      },
      insurancePolicyHolderName: {
        value: 'FirstName ZZTEST',
        dirty: true
      },
      insurancePolicyNumber: {
        value: 'P1234',
        dirty: true
      },
      insuranceGroupCode: {
        value: 'G1234',
        dirty: true
      }
    }
  ],
  isMedicaidEligible: {
    value: 'Y',
    dirty: true
  },
  isEnrolledMedicarePartA: {
    value: 'Y',
    dirty: true
  },
  medicarePartAEffectiveDate: {
    month: {
      value: '10',
      dirty: true
    },
    day: {
      value: '16',
      dirty: true
    },
    year: {
      value: '1999',
      dirty: true
    }
  },
  lastServiceBranch: {
    value: 'merchant seaman',
    dirty: true
  },
  lastEntryDate: {
    month: {
      value: '3',
      dirty: true
    },
    day: {
      value: '7',
      dirty: true
    },
    year: {
      value: '1980',
      dirty: true
    }
  },
  lastDischargeDate: {
    month: {
      value: '7',
      dirty: true
    },
    day: {
      value: '8',
      dirty: true
    },
    year: {
      value: '1984',
      dirty: true
    }
  },
  dischargeType: {
    value: 'general',
    dirty: true
  },
  purpleHeartRecipient: false,
  isFormerPow: true,
  postNov111998Combat: true,
  disabledInLineOfDuty: true,
  swAsiaCombat: true,
  vietnamService: true,
  exposedToRadiation: true,
  radiumTreatments: true,
  campLejeune: true
};

function veteranToApplication(veteran) {
  if (_.includes(['Never Married', 'Widowed', 'Divorced'], veteran.maritalStatus.value) || veteran.discloseFinancialInformation.value === 'N') {
    /* eslint-disable no-param-reassign */
    delete veteran.spouseAddress;
    delete veteran.spouseFullName;
    delete veteran.spouseGrossIncome;
    delete veteran.spouseNetIncome;
    delete veteran.spouseOtherIncome;
    delete veteran.spouseSocialSecurityNumber;
    delete veteran.spouseDateOfBirth;
    delete veteran.spousePhone;
    /* eslint-enable no-param-reassign */
  }

  if (veteran.discloseFinancialInformation.value === 'N') {
    veteran.children = []; // eslint-disable-line no-param-reassign
  }

  return JSON.stringify(veteran, (key, value) => {
    // Remove properties that are not interesting to the API.
    switch (key) {
      case 'emailConfirmation':
      case 'hasChildrenToReport':
        return undefined;

      default:
        // fall through.
    }

    switch (key) {
      // Convert radio buttons into booleans.
      case 'isVaServiceConnected':
      case 'compensableVaServiceConnected':
      case 'provideSupportLastYear':
      case 'receivesVaPension':
      case 'sameAddress':
      case 'cohabitedLastYear':
      case 'isCoveredByHealthInsurance':
      case 'isMedicaidEligible':
      case 'isEnrolledMedicarePartA':
      case 'wantsInitialVaContact':
      case 'childDisabledBefore18':
      case 'childAttendedSchoolLastYear':
      case 'childCohabitedLastYear':
      case 'childReceivedSupportLastYear':
      case 'discloseFinancialInformation':
        return value.value === 'Y';

      case 'childEducationExpenses':
      case 'deductibleEducationExpenses':
      case 'deductibleFuneralExpenses':
      case 'deductibleMedicalExpenses':
      case 'grossIncome':
      case 'netIncome':
      case 'otherIncome':
      case 'spouseGrossIncome':
      case 'spouseNetIncome':
      case 'spouseOtherIncome':
      case 'veteranGrossIncome':
      case 'veteranNetIncome':
      case 'veteranOtherIncome':
        return Number(value.value);

      // Optional Date fields
      case 'spouseDateOfBirth':
      case 'dateOfMarriage':
      case 'medicarePartAEffectiveDate':
        if (value.day.value === '' && value.month.value === '' && value.year.value === '') {
          return undefined;
        }
        break;

      // Optional String fields
      case 'spouseSocialSecurityNumber':
      case 'cityOfBirth':
      case 'stateOfBirth':
      case 'email':
        if (value.value === '') {
          return undefined;
        }
        break;

      case 'homePhone':
      case 'mobilePhone':
      case 'spousePhone':
        if (value.value === '') {
          return undefined;
        }
        return value.value.replace(/[^\d]/g, '');

      default:
        // fall through.
    }

    // Turn date fields into ISO8601 dates. Doing this manually because the format is constricted
    // enough that going through the Javascript Date object has no real benefit and instead
    // just inserts runtime envrionment compatibility concerns with whether or not the date is
    // read as localtime or UTC.
    //
    // Testing of this is tricky as it will only be noticeable if the runtime has different
    // timezone from expectation and tests are run at a time of day where there might be
    // an issue.
    if (value.day !== undefined && value.month !== undefined && value.year !== undefined) {
      let iso8601date = value.year.value;
      iso8601date += '-';
      if (parseInt(value.month.value, 10) < 10) {
        iso8601date += '0';
      }
      iso8601date += value.month.value;

      iso8601date += '-';
      if (parseInt(value.day.value, 10) < 10) {
        iso8601date += '0';
      }
      iso8601date += value.day.value;

      return iso8601date;
    }

    // Strips out suffix if the user does not enter it.
    // TODO: Strip out other fields that are passing empty string.
    if (value.suffix !== undefined && value.suffix.value === '') {
      return _.omit(value, ['suffix']);
    }

    // Strip all the dirty flags out of the veteran and flatted it into a single atomic value.
    // Do this last in the sequence as a sweep of all remaining objects that are not special cased.
    if (value.value !== undefined && value.dirty !== undefined) {
      return value.value;
    }

    return value;
  });
}

module.exports = { blankVeteran, completeVeteran, veteranToApplication };
