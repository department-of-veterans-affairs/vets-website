import _ from 'lodash';
import { countries, states } from '../utils/options-for-select';

/*
 * These are schema definitions for some common form fields
 */

export const fullName = {
  type: 'object',
  title: '',
  required: ['first', 'last'],
  properties: {
    first: {
      type: 'string',
    },
    middle: {
      type: 'string',
    },
    last: {
      type: 'string',
      minLength: 1,
      maxLength: 30
    },
    suffix: {
      type: 'string',
      'enum': [
        '',
        'Jr.',
        'Sr.',
        'II',
        'III',
        'IV'
      ]
    }
  }
};

export const ssn = {
  type: 'string',
  pattern: '^([0-9]{3}-[0-9]{2}-[0-9]{4}|[0-9]{9})$'
};

export const date = {
  pattern: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
  type: 'string'
};

export const dateRange = {
  type: 'object',
  properties: {
    from: date,
    to: date
  }
};

// const countryValues = countries.map(object => object.value);
// const countryNames = countries.map(object => object.label);

// export const address = {
//   type: 'object',
//   title: 'Address',
//   required: ['street', 'city', 'country', 'state', 'postalCode'],
//   properties: {
//     country: {
//       'default': 'USA',
//       type: 'string',
//       'enum': countryValues,
//       enumNames: countryNames
//     },
//     street: {
//       type: 'string',
//       minLength: 1,
//       maxLength: 50
//     },
//     street2: {
//       type: 'string',
//       minLength: 1,
//       maxLength: 50
//     },
//     city: {
//       type: 'string',
//       minLength: 1,
//       maxLength: 51
//     },
//     state: {
//       type: 'string'
//     },
//     postalCode: {
//       type: 'string',
//       maxLength: 10
//     }
//   }
// };

const address = (() => {
  const countryValues = countries.map(object => object.value);
  const countriesWithAnyState = Object.keys(states).filter(x => _.includes(countryValues, x));
  const countryStateProperites = _.map(states, (value, key) => ({
    properties: {
      country: {
        'enum': [key]
      },
      state: {
        'enum': value.map(x => x.value)
      },
      postalCode: {
        type: 'string',
        maxLength: 10
      }
    }
  }));
  countryStateProperites.push({
    properties: {
      country: {
        not: {
          'enum': countriesWithAnyState
        }
      },
      state: {
        type: 'string',
        maxLength: 51
      },
      postalCode: {
        type: 'string',
        maxLength: 51
      },
    },
  });

  return {
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
  };
})();

export const phone = {
  type: 'string',
  minLength: 10
};
