// Relocate options-for-select.
const options = require('../../hca/utils/options-for-select');
const _ = require('lodash');

// const states = _.uniq(_.flatten(_.values(options.states)).map(object => object.value));
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
  title: 'Education Benefits Claim',
  type: 'object',
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
        street2: {
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
    date: {
      format: 'date',
      type: 'string'
    },
    dateRange: {
      type: 'object',
      properties: {
        from: {
          $ref: '#/definitions/date'
        },
        to: {
          $ref: '#/definitions/date'
        }
      }
    },
    fullName: {
      type: 'object',
      properties: {
        salutation: {
          type: 'string'
        },
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
    phone: {
      type: 'string',
      pattern: '^[0-9]{10}$'
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
  properties: {
    chapter33: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean'
        },
        electionType: {
          type: 'string'
        },
        electionDate: {
          type: 'string',
          format: 'date-time'
        }
      }
    },
    chapter30: {
      type: 'boolean'
    },
    chapter1606: {
      type: 'boolean'
    },
    chapter32: {
      type: 'boolean'
    },
    fullName: {
      $ref: '#/definitions/fullName'
    },
    gender: {
      type: 'string',
      pattern: '^(M|F)$'
    },
    birthday: {
      type: 'string',
      format: 'date-time'
    },
    socialSecurityNumber: {
      $ref: '#/definitions/ssn'
    },
    address: {
      $ref: '#/definitions/address'
    },
    phone: {
      $ref: '#/definitions/phone'
    },
    // "secondaryPhoneNumber": {
    //   "$ref": "#/definitions/phoneNumber"
    // },
    emergencyContact: {
      type: 'object',
      properties: {
        // "name": {
        //   "$ref": "#/definitions/name"
        // },
        sameAddressAndPhone: {
          type: 'boolean'
        },
        // "address": {
        //   "$ref": "#/definitions/address"
        // },
        // "phoneNumber": {
        //   "$ref": "#/definitions/phoneNumber"
        // },
      }
    },
    bankAccount: {
      type: 'object',
      properties: {
        accountType: {
          type: 'string',
          pattern: '^(checking|savings)$'
        },
        bankName: {
          type: 'string'
        },
        routingNumber: {
          type: 'string'
        },
        accountNumber: {
          type: 'string'
        }
      }
    },
    previouslyFiledClaimWithVa: {
      type: 'boolean'
    },
    previouslyAppliedWithSomeoneElsesService: {
      type: 'boolean'
    },
    alreadyReceivedInformationPamphlet: {
      type: 'boolean'
    },
    schoolName: {
      type: 'string'
    },
    // "schoolAddress": {
    //   "$ref": "#/definitions/address"
    // },
    educationStartDate: {
      type: 'string',
      format: 'date-time'
    },
    educationalObjective: {
      type: 'string'
    },
    courseOfStudy: {
      type: 'string'
    },
    educationType: {
      type: 'object',
      properties: {
        college: {
          type: 'boolean'
        },
        correspondence: {
          type: 'boolean'
        },
        apprenticeship: {
          type: 'boolean'
        },
        flightTraining: {
          type: 'boolean'
        },
        testReimbursement: {
          type: 'boolean'
        },
        licensingReimbursement: {
          type: 'boolean'
        },
        tuitionTopUp: {
          type: 'boolean'
        }
      }
    },
    currentlyActiveDuty: {
      type: 'boolean'
    },
    terminalLeaveBeforeDischarge: {
      type: 'boolean'
    },
    highSchoolOrGedCompletionDate: {
      type: 'string',
      format: 'date-time'
    }
  }
};
