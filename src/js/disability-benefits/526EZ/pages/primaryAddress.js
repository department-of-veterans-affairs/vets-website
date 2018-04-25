import _ from 'lodash';

import dateUI from '../../../common/schemaform/definitions/date';
import SSNWidget from '../../../common/schemaform/widgets/SSNWidget';

import VerifiedReviewContainer from '../components/VerifiedReviewContainer';
import {
  PrimaryAddressViewField,
  getPage
} from '../helpers';

import initialData from '../tests/schema/initialData';

const typeLabels = {
  DOMESTIC: 'Domestic',
  MILITARY: 'Military',
  INTERNATIONAL: 'International'
};

const militaryPostOfficeTypeCodes = ['APO', 'DPO', 'FPO'];

const militaryStates = ['AA', 'AE', 'AP'];

const states = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FM',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MH',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'PW',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
  'PI',
  'UM'
];

const allStates = _.merge([], states, militaryStates);

const stateLabels = {
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
  AZ: 'Arizona',
  AR: 'Arkansas',
  AA: 'Armed Forces Americas (AA)',
  AE: 'Armed Forces Europe (AE)',
  AP: 'Armed Forces Pacific (AP)',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FM: 'Federated States Of Micronesia',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  MP: 'Northern Mariana Islands',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PW: 'Palau',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VI: 'Virgin Islands',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  PI: 'Rizal state',
  UM: 'United States Minor Outlying Islands'
};

const countries = [
  'USA',
  'Afghanistan',
  'Albania',
  'Algeria',
  'Angola',
  'Anguilla',
  'Antigua',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Azores',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Barbuda',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia-Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burma',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo, Democratic Republic of',
  "Congo, People's Republic of",
  'Costa Rica',
  "Cote d'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'England',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Great Britain',
  'Great Britain and Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guatemala',
  'Guinea',
  'Guinea, Republic of Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel (Jerusalem)',
  'Israel (Tel Aviv)',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Leeward Islands',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Mali',
  'Malta',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Moldavia',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Nepal',
  'Netherlands',
  'Netherlands Antilles',
  'Nevis',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'Northern Ireland',
  'Norway',
  'Oman',
  'Pakistan',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Philippines (restricted payments)',
  'Poland',
  'Portugal',
  'Qatar',
  'Republic of Yemen',
  'Romania',
  'Russia',
  'Rwanda',
  'Sao-Tome/Principe',
  'Saudi Arabia',
  'Scotland',
  'Senegal',
  'Serbia',
  'Serbia/Montenegro',
  'Seychelles',
  'Sicily',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Somalia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'St. Kitts',
  'St. Lucia',
  'St. Vincent',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey (Adana only)',
  'Turkey (except Adana)',
  'Turkmenistan',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Wales',
  'Western Samoa',
  'Yemen Arab Republic',
  'Zambia',
  'Zimbabwe'
];

export const militaryPostOfficeTypeLabels = { // TODO: determine whether these are necessary
  APO: 'Army Post Office',
  FPO: 'Fleet Post Office',
  DPO: 'Diplomatic Post Office'
};

function isValidSpecialCharacter(value) {
  if (value !== null) {
    return /([a-zA-Z0-9-'.,,&#]([a-zA-Z0-9-'.,,&# ])?)+$/.test(value);
  }
  return true;
}

function isValidZIP(value) {
  if (value !== null) {
    return /^\d{5}([-\s]?\d{4})?$/.test(value);
  }
  return true;
}

function isValidPhone(value) {
  if (value !== null) {
    return /^\d{10}$/.test(value);
  }
  return true;
}

function validateSpecialCharacter(errors, string) {
  if (string && !isValidSpecialCharacter(string)) {
    errors.addError(
      "Please only use letters, numbers, and the special characters #%&'()+,./:@"
    );
  }
}

function validatePhone(errors, phone) {
  if (phone && !isValidPhone(phone)) {
    errors.addError(
      'Phone numbers must be 10 digits'
    );
  }
}

function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError('Please enter a valid 9 digit ZIP (dashes allowed)');
  }
}


const addressUISchema = (addressName, title) => {

  function validateCity(errors, city, { veteran }) {
    const state = veteran[addressName]['view:state'];
    const isMilitaryState = militaryStates.includes(state);
    const isMilitaryCity = militaryPostOfficeTypeCodes.includes(city);
    if (city && state && isMilitaryState && !isMilitaryCity) {
      errors.addError(
        'Please enter APO, FPO, or DPO'
      );
    }
  }

  return {
    'ui:title': title,
    type: {
      'ui:options': {
        hideIf: () => true,
        updateSchema: (formData, schema) => {
          /* eslint-disable no-param-reassign */
          const address = formData.veteran[addressName];
          const country = address.country;
          const state = address['view:state'];
          const city = address['view:city'];
          const isDomestic = country === 'USA';
          const isMilitary = militaryPostOfficeTypeCodes.includes(city) || militaryStates.includes(state);
          if (isDomestic) {
            formData.veteran[addressName].type = 'DOMESTIC';
          } else if (isMilitary) {
            formData.veteran[addressName].type = 'MILITARY';
          } else if (country) {
            formData.veteran[addressName].type = 'INTERNATIONAL';
          }
          return schema;
          /* eslint-enable no-param-reassign */
        }
      }
    },
    country: {
      'ui:title': 'Country'
    },
    'view:state': {
      'ui:title': 'State',
      'ui:required': (formData) => {
        const address = formData.veteran[addressName];
        const isUSA = address.country === 'USA';
        const isMilitary = !!address.militaryPostOfficeTypeCode;
        return isUSA || isMilitary;
      },
      'ui:options': {
        labels: stateLabels,
        updateSchema: (formData, schema) => {
          /* eslint-disable no-param-reassign */
          const address = formData.veteran[addressName];
          const viewState = address['view:state'];
          const state = address.state;
          const militaryState = address.militaryState;
          if (militaryStates.includes(viewState)) {
            formData.veteran[addressName].militaryState = viewState;
            delete formData.veteran[addressName].state;
            delete formData.veteran[addressName].city;
          } else if (viewState) {
            formData.veteran[addressName].state = viewState;
            delete formData.veteran[addressName].militaryState;
            delete formData.veteran[addressName].militaryPostOfficeTypeCode;
          } else {
            formData.veteran[addressName]['view:state'] = (state || militaryState);
          }
          return schema;
          /* eslint-enable no-param-reassign */
        }
      }
    },
    state: {
      'ui:options': {
        labels: stateLabels,
        hideIf: () => true
      }
    },
    addressLine1: {
      'ui:title': 'Street',
      'ui:validations': [validateSpecialCharacter],
    },
    addressLine2: {
      'ui:title': 'Line 2',
      'ui:validations': [validateSpecialCharacter],
    },
    addressLine3: {
      'ui:title': 'Line 3',
      'ui:validations': [validateSpecialCharacter],
    },
    'view:city': {
      'ui:title': 'City or Military Post Office Type',
      'ui:validations': [validateSpecialCharacter, validateCity],
      'ui:options': {
        updateSchema: (formData, schema) => {
          /* eslint-disable no-param-reassign */
          const address = formData.veteran[addressName];
          const viewCity = address['view:city'];
          const city = address.city;
          const militaryPostOfficeType = address.militaryPostOfficeType;
          if (militaryPostOfficeTypeCodes.includes(viewCity)) {
            formData.veteran[addressName].militaryPostOfficeTypeCode = viewCity;
            delete formData.veteran[addressName].city;
          } else if (viewCity) {
            formData.veteran[addressName].city = viewCity;
            delete formData.veteran[addressName].militaryPostOfficeTypeCode;
            delete formData.veteran[addressName].militaryState;
          } else {
            formData.veteran[addressName]['view:city'] = (city || militaryPostOfficeType);
          }
          return schema;
          /* eslint-enable no-param-reassign */
        }
      }
    },
    city: {
      'ui:options': {
        hideIf: () => true
      }
    },
    militaryStateCode: {
      'ui:options': {
        hideIf: () => true
      }
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:validations': [validateZIP],
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5 or 9 digit ZIP code (dashes allowed)'
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
      }
    },
    militaryPostOfficeTypeCode: {
      'ui:title': 'Military Post Office Type Code',
      'ui:options': {
        labels: militaryPostOfficeTypeLabels,
        hideIf: () => true
      }
    },
    'ui:options': {
      updateSchema: (formData, schema) => {
        const newSchema = _.merge({}, schema);
        const state = formData.veteran[addressName].state;
        const isMilitaryState = militaryStates.includes(state);
        /* eslint-disable no-param-reassign */
        if (isMilitaryState) {
          newSchema.properties['view:city'].enum = militaryPostOfficeTypeCodes;
        } else {
          delete schema.properties['view:city'].enum;
        }
        return newSchema;
        /* eslint-enable no-param-reassign */
      }
    }
  };
};

const addressSchema = (isRequired = false) => {
  return {
    type: 'object',
    required: isRequired ? ['country', 'addressLine1', 'view:city'] : [],
    properties: {
      type: {
        type: 'string',
        'enum': ['MILITARY', 'DOMESTIC', 'INTERNATIONAL']
      },
      country: {
        type: 'string',
        'enum': countries
      },
      'view:state': {
        type: 'string',
        'enum': allStates
      },
      state: {
        type: 'string',
        'enum': allStates
      },
      addressLine1: {
        type: 'string',
        maxLength: 35,
        pattern: "([a-zA-Z0-9-'.,,&#]([a-zA-Z0-9-'.,,&# ])?)+$"
      },
      addressLine2: {
        type: 'string',
        maxLength: 35,
        pattern: "([a-zA-Z0-9-'.,,&#]([a-zA-Z0-9-'.,,&# ])?)+$"
      },
      addressLine3: {
        type: 'string',
        maxLength: 35,
        pattern: "([a-zA-Z0-9-'.,,&#]([a-zA-Z0-9-'.,,&# ])?)+$"
      },
      'view:city': {
        type: 'string',
        maxLength: 35,
        pattern: "([a-zA-Z0-9-'.#]([a-zA-Z0-9-'.# ])?)+$"
      },
      city: {
        type: 'string',
        maxLength: 35,
        pattern: "([a-zA-Z0-9-'.#]([a-zA-Z0-9-'.# ])?)+$"
      },
      zipCode: {
        type: 'string'
      },
      militaryPostOfficeTypeCode: {
        type: 'string',
        'enum': ['APO', 'DPO', 'FPO']
      },
      militaryStateCode: {
        type: 'string',
        'enum': ['AA', 'AE', 'AP']
      }
    }
  };
};

function createPrimaryAddressPage(formSchema, isReview) {
  const { date } = formSchema.definitions;

  const uiSchema = {
    veteran: {
      mailingAddress: addressUISchema('mailingAddress'),
      primaryPhone: {
        'ui:title': 'Primary telephone number',
        'ui:widget': SSNWidget, // TODO: determine whether to rename widget
        'ui:validations': [validatePhone],
        'ui:errorMessages': {
          pattern: 'Phone numbers must be 10 digits'
        }
      },
      secondaryPhone: {
        'ui:title': 'Secondary telephone number',
        'ui:widget': SSNWidget,
        'ui:validations': [validatePhone],
        'ui:errorMessages': {
          pattern: 'Phone numbers must be 10 digits'
        }
      },
      emailAddress: {
        'ui:title': 'Email address',
        'ui:errorMessages': {
          pattern: 'Please put your email in this format x@x.xxx'
        }
      },
      'view:hasForwardingAddress': {
        'ui:title':
        'I want to provide a forwarding address since my address will be changing soon.'
      },
      forwardingAddress: _.merge(
        addressUISchema('forwardingAddress', 'Forwarding address'),
        {
          'ui:options': {
            expandUnder: 'view:hasForwardingAddress'
          },
          country: {
            'ui:required': formData => _.get("veteran['view:hasForwardingAddress']", formData)
          },
          addressLine1: {
            'ui:required': formData => _.get("veteran['view:hasForwardingAddress']", formData)
          },
          effectiveDate: dateUI('Effective date')
        }
      )
    }
  };
  const addressConfig = addressSchema(true);
  const schema = {
    type: 'object',
    properties: {
      veteran: {
        type: 'object',
        properties: {
          mailingAddress: addressConfig,
          primaryPhone: {
            type: 'string'
          },
          secondaryPhone: {
            type: 'string'
          },
          emailAddress: {
            type: 'string',
            format: 'email'
          },
          'view:hasForwardingAddress': {
            type: 'boolean'
          },
          forwardingAddress: _.merge({}, addressConfig, {
            type: 'object',
            properties: {
              effectiveDate: date
            }
          })
        }
      }
    }
  };

  const pageConfig = {
    pageTitle: 'Address information',
    isReview,
    component: VerifiedReviewContainer,
    description: 'Here’s the address we have on file for you. We’ll use this address to mail you any important information about your disability claim. If you need to update your address, you can click the Edit button.',
    verifiedReviewComponent: PrimaryAddressViewField,
    uiSchema,
    schema,
    initialData
  };

  return getPage(pageConfig, 'Veteran Details');
}

export const createVerifiedPrimaryAddressPage = formConfig =>
  createPrimaryAddressPage(formConfig, true);

export const createUnverifiedPrimaryAddressPage = formConfig =>
  createPrimaryAddressPage(formConfig, false);
