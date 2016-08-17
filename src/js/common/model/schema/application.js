// Relocate options-for-select.
const options = require('../../client/utils/options-for-select');
const _ = require('lodash');

const states = _.uniq(_.flatten(_.values(options.states)).map(object => object.value));
const countries = options.countries.map(object => object.value);
const countriesWithAnyState = Object.keys(options.states).filter(x => _.includes(countries, x));
const countryStateProperites = _.map(options.states, (value, key) => ({
  properties: {
    country: {
      'enum': [key]
    },
    state: {
      'enum': value.map(x => x.value)
    },
    zipcode: {
      type: 'string',
      maxLength: 50
    }
  }
}));
countryStateProperites.push(
  {
    properties: {
      country: {
        not: {
          'enum': countriesWithAnyState
        }
      },
      provinceCode: {
        type: 'string',
        maxLength: 51
      },
      postalCode: {
        type: 'string',
        maxLength: 51
      },
    },
  });

module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  definitions: {
    address: {
      type: 'object',
      oneOf: countryStateProperites,
      properties: {
        street: {
          type: 'string',
          minLength: 1,
          maxLength: 50
        },
        city: {
          type: 'string',
          minLength: 1,
          maxLength: 51
        }
      },
      required: [
        'street',
        'city',
        'country'
      ]
    },
    child: {
      type: 'object',
      properties: {
        childFullName: {
          $ref: '#/definitions/fullName'
        },
        childRelation: {
          'enum': options.childRelationships
        },
        childSocialSecurityNumber: {
          $ref: '#/definitions/ssn'
        },
        childBecameDependent: {
          $ref: '#/definitions/date'
        },
        childDateOfBirth: {
          $ref: '#/definitions/date'
        },
        childDisabledBefore18: {
          type: 'boolean'
        },
        childAttendedSchoolLastYear: {
          type: 'boolean'
        },
        childEducationExpenses: {
          $ref: '#/definitions/monetaryValue'
        },
        childCohabitedLastYear: {
          type: 'boolean'
        },
        childReceivedSupportLastYear: {
          type: 'boolean'
        },
        grossIncome: {
          $ref: '#/definitions/monetaryValue'
        },
        netIncome: {
          $ref: '#/definitions/monetaryValue'
        },
        otherIncome: {
          $ref: '#/definitions/monetaryValue'
        },
      }
    },
    date: {
      format: 'date',
      type: 'string'
    },
    fullName: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
          minLength: 1,
          maxLength: 30
        },
        middle: {
          type: 'string'
        },
        last: {
          type: 'string',
          minLength: 1,
          maxLength: 30
        },
        suffix: {
          'enum': options.suffixes
        },
      },
      required: [
        'first',
        'last'
      ]
    },
    monetaryValue: {
      type: 'number',
      minimum: 0,
      maximum: 9999999.99,
    },
    phone: {
      type: 'string',
      pattern: '^[0-9]{10}$'
    },
    provider: {
      type: 'object',
      properties: {
        insuranceName: {
          type: 'string',
        },
        insurancePolicyHolderName: {
          type: 'string',
        },
        insurancePolicyNumber: {
          type: 'string',
        },
        insuranceGroupCode: {
          type: 'string',
        },
      },
    },
    ssn: {
      oneOf: [
        {
          type: 'string',
          pattern: '^[0-9]{9}$'
        }, {
          type: 'string',
          pattern: '^[0-9]{3}-[0-9]{2}-[0-9]{4}$'
        }
      ]
    },
  },
  type: 'object',
  properties: {
    veteranFullName: {
      $ref: '#/definitions/fullName'
    },
    //  Revisit how to validate that this is either empty or a string between 2 and 35 characters
    mothersMaidenName: {
      type: 'string'
    },
    veteranSocialSecurityNumber: {
      $ref: '#/definitions/ssn'
    },
    gender: {
      'enum': options.genders.map(option => option.value)
    },
    cityOfBirth: {
      type: 'string',
      minLength: 2,
      maxLength: 20
    },
    stateOfBirth: {
      'enum': states
    },
    veteranDateOfBirth: {
      $ref: '#/definitions/date'
    },
    maritalStatus: {
      'enum': options.maritalStatuses
    },
    isVaServiceConnected: {
      type: 'boolean'
    },
    compensableVaServiceConnected: {
      type: 'boolean'
    },
    receivesVaPension: {
      type: 'boolean'
    },
    isEssentialAcaCoverage: {
      type: 'boolean'
    },
    vaMedicalFacility: {
      'enum': _.flatten(_.values(options.vaMedicalFacilities)).map(object => object.value)
    },
    wantsInitialVaContact: {
      type: 'boolean'
    },
    isSpanishHispanicLatino: {
      type: 'boolean'
    },
    isAmericanIndianOrAlaskanNative: {
      type: 'boolean'
    },
    isBlackOrAfricanAmerican: {
      type: 'boolean'
    },
    isNativeHawaiianOrOtherPacificIslander: {
      type: 'boolean'
    },
    isAsian: {
      type: 'boolean'
    },
    isWhite: {
      type: 'boolean'
    },
    veteranAddress: {
      $ref: '#/definitions/address'
    },
    email: {
      type: 'string',
      pattern: '^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$' // Email pattern from RegEx 101 https://regex101.com/
    },
    homePhone: {
      $ref: '#/definitions/phone'
    },
    mobilePhone: {
      $ref: '#/definitions/phone'
    },
    understandsFinancialDisclosure: {
      type: 'boolean'
    },
    spouseFullName: {
      $ref: '#/definitions/fullName'
    },
    spouseSocialSecurityNumber: {
      $ref: '#/definitions/ssn'
    },
    spouseDateOfBirth: {
      $ref: '#/definitions/date'
    },
    dateOfMarriage: {
      $ref: '#/definitions/date'
    },
    sameAddress: {
      type: 'boolean'
    },
    cohabitedLastYear: {
      type: 'boolean'
    },
    provideSupportLastYear: {
      type: 'boolean'
    },
    spouseAddress: {
      $ref: '#/definitions/address'
    },
    spousePhone: {
      $ref: '#/definitions/phone'
    },
    children: {
      type: 'array',
      items: {
        $ref: '#/definitions/child'
      },
    },
    veteranGrossIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    veteranNetIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    veteranOtherIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    spouseGrossIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    spouseNetIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    spouseOtherIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    deductibleMedicalExpenses: {
      $ref: '#/definitions/monetaryValue'
    },
    deductibleFuneralExpenses: {
      $ref: '#/definitions/monetaryValue'
    },
    deductibleEducationExpenses: {
      $ref: '#/definitions/monetaryValue'
    },
    isCoveredByHealthInsurance: {
      type: 'boolean'
    },
    providers: {
      type: 'array',
      items: {
        $ref: '#/definitions/provider'
      },
    },
    isMedicaidEligible: {
      type: 'boolean'
    },
    isEnrolledMedicarePartA: {
      type: 'boolean'
    },
    medicarePartAEffectiveDate: {
      $ref: '#/definitions/date'
    },
    lastServiceBranch: {
      'enum': options.branchesServed.map(option => option.value)
    },
    lastEntryDate: {
      $ref: '#/definitions/date'
    },
    lastDischargeDate: {
      $ref: '#/definitions/date'
    },
    dischargeType: {
      'enum': options.dischargeTypes.map(option => option.value)
    },
    purpleHeartRecipient: {
      type: 'boolean'
    },
    isFormerPow: {
      type: 'boolean'
    },
    postNov111998Combat: {
      type: 'boolean'
    },
    disabledInLineOfDuty: {
      type: 'boolean'
    },
    swAsiaCombat: {
      type: 'boolean'
    },
    vietnamService: {
      type: 'boolean'
    },
    exposedToRadiation: {
      type: 'boolean'
    },
    radiumTreatments: {
      type: 'boolean'
    },
    campLejeune: {
      type: 'boolean'
    }
  },
  required: [
    'veteranFullName',
    'veteranSocialSecurityNumber',
    'veteranDateOfBirth',
    'gender',
    'maritalStatus',
    'vaMedicalFacility',
    'isSpanishHispanicLatino',
    'veteranAddress',
    'isMedicaidEligible',
    'isEnrolledMedicarePartA',
    'lastServiceBranch',
    'lastEntryDate',
    'lastDischargeDate',
    'dischargeType'
  ]
};
