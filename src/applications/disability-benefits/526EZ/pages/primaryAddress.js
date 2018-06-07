import _ from 'lodash';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';

import dateUI from '../../../common/schemaform/definitions/date';
import PhoneNumberWidget from '../../../common/schemaform/widgets/PhoneNumberWidget';

import ReviewCardField from '../components/ReviewCardField';

import { PrimaryAddressViewField, MILITARY_STATES, MILITARY_CITIES, USA } from '../helpers';
import { omitRequired } from '../../../common/schemaform/helpers.js';

function isValidZIP(value) {
  if (value !== null) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}

function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError('Please enter a valid 9 digit ZIP (dashes allowed)');
  }
}

function validateMilitaryCity(errors, city, formData, schema, messages, options) {
  const isMilitaryState = MILITARY_STATES.includes(formData.veteran[options.addressName].state);
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError('City must match APO, DPO, or FPO when using a military state code');
  }
}

function validateMilitaryState(errors, state, formData, schema, messages, options) {
  const isMilitaryCity = MILITARY_CITIES.includes(formData.veteran[options.addressName].city.trim().toUpperCase());
  const isMilitaryState = MILITARY_STATES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}

const hasForwardingAddress = (veteran) => (veteran['view:hasForwardingAddress'] === true);

const states = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'AA',
  'AE',
  'AP',
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

const addressUISchema = (addressName, title) => {
  return {
    'ui:order': [
      'country',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'state',
      'zipCode'
    ],
    'ui:title': title,
    country: {
      'ui:title': 'Country'
    },
    addressLine1: {
      'ui:title': 'Street address'
    },
    addressLine2: {
      'ui:title': 'Street address (optional)'
    },
    addressLine3: {
      'ui:title': 'Street address (optional)'
    },
    city: {
      'ui:title': 'City',
      'ui:validations': [{
        options: { addressName },
        validator: validateMilitaryCity
      }]
    },
    state: {
      'ui:title': 'State',
      'ui:required': ({ veteran }) => (veteran.mailingAddress.country === USA),
      'ui:options': {
        labels: stateLabels,
        hideIf: ({ veteran }) => (veteran.mailingAddress.country !== USA),
      },
      'ui:validations': [{
        options: { addressName },
        validator: validateMilitaryState
      }]
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:validations': [validateZIP],
      'ui:required': ({ veteran }) => (veteran.mailingAddress.country === USA),
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5- or 9- digit ZIP code (dashes allowed)'
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        hideIf: ({ veteran }) => (veteran.mailingAddress.country !== USA)
      }
    },
  };
};

const addressSchema = {
  type: 'object',
  required: ['country', 'city', 'addressLine1'],
  properties: {
    country: {
      type: 'string',
      'enum': countries
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
    city: {
      type: 'string',
      maxLength: 35,
      pattern: "([a-zA-Z0-9-'.#]([a-zA-Z0-9-'.# ])?)+$"
    },
    state: {
      type: 'string',
      'enum': states
    },
    zipCode: {
      type: 'string'
    }
  }
};

export const uiSchema = {
  veteran: {
    'ui:title': 'Contact information',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PrimaryAddressViewField
    },
    'ui:order': [
      'mailingAddress',
      'primaryPhone',
      'emailAddress',
      'view:hasForwardingAddress',
      'forwardingAddress'
    ],
    mailingAddress: addressUISchema('mailingAddress'),
    primaryPhone: {
      'ui:title': 'Primary telephone number',
      'ui:widget': PhoneNumberWidget,
      'ui:errorMessages': {
        pattern: 'Phone numbers must be 10 digits (dashes allowed)'
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large'
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
        'ui:order': [
          'effectiveDate',
          'country',
          'addressLine1',
          'addressLine2',
          'addressLine3',
          'city',
          'state',
          'zipCode'
        ],
        effectiveDate: _.merge(
          {},
          dateUI('Effective date'),
          { 'ui:required': ({ veteran }) => (hasForwardingAddress(veteran)) }
        ),
        country: {
          'ui:required': ({ veteran }) => (hasForwardingAddress(veteran)),

        },
        addressLine1: {
          'ui:required': ({ veteran }) => (hasForwardingAddress(veteran))
        },
        city: {
          'ui:required': ({ veteran }) => (hasForwardingAddress(veteran))
        },
        state: {
          'ui:required': ({ veteran }) => (
            hasForwardingAddress(veteran)
            && veteran.forwardingAddress.country === USA),
          'ui:options': {
            hideIf: ({ veteran }) => (veteran.forwardingAddress.country !== USA)
          }
        },
        zipCode: {
          'ui:required': ({ veteran }) => (
            hasForwardingAddress(veteran)
            && veteran.forwardingAddress.country === USA),
          'ui:options': {
            hideIf: ({ veteran }) => (veteran.forwardingAddress.country !== USA)
          }
        }
      }
    )
  }
};

export const primaryAddressSchema = {
  type: 'object',
  properties: {
    veteran: {
      type: 'object',
      properties: {
        mailingAddress: addressSchema,
        primaryPhone: {
          type: 'string',
          pattern: '^\\d{10}$'
        },
        emailAddress: {
          type: 'string',
          format: 'email'
        },
        'view:hasForwardingAddress': {
          type: 'boolean'
        },
        forwardingAddress: _.merge({}, omitRequired(addressSchema), {
          type: 'object',
          properties: {
            effectiveDate: fullSchema526EZ.definitions.date
          }
        })
      }
    }
  }
};

