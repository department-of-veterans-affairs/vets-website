import _ from 'lodash';

import phoneUI from '../../../common/schemaform/definitions/phone';
import dateUI from '../../../common/schemaform/definitions/date';
import SSNWidget from '../../../common/schemaform/widgets/SSNWidget';
import SSNReviewWidget from '../../../common/schemaform/review/SSNWidget';

import VerifiedReviewContainer from '../components/VerifiedReviewContainer';
import { PrimaryAddressViewField, getPage } from '../helpers';

import initialData from '../../../../../test/disability-benefits/526EZ/schema/initialData';

// TODO: move address to utils (create)

const USAOnly = ['USA'];

const countries = [
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

const typeLabels = {
  DOMESTIC: 'Domestic',
  MILITARY: 'Military',
  INTERNATIONAL: 'International'
};

export const militaryPostOfficeTypeLabels = {
  APO: 'Army Post Office',
  FPO: 'Fleet Post Office',
  DPO: 'Diplomatic Post Office'
};

const requiredFields = ['country', 'addressLine1'];

function isValidZIP(value) {
  if (value !== null) {
    return /^\d{9}$/.test(value) || /^\d{5}-\d{4}$/.test(value);
  }
  return true;
}

function isValidPhone(value) {
  if (value !== null) {
    return /^\d{10}$/.test(value) || /^\d{11}$/.test(value);
  }
  return true;
}

function validatePhone(errors, phone) {
  if (phone && !isValidPhone(phone)) {
    errors.addError(
      'Phone numbers must be at least 10 digits (dashes allowed)'
    );
  }
}

function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError('Please enter a valid 9 digit ZIP (dashes allowed)');
  }
}

const addressSchema = {
  type: 'object',
  required: requiredFields,
  properties: {
    type: {
      'default': 'DOMESTIC',
      type: 'string',
      'enum': ['DOMESTIC', 'MILITARY', 'INTERNATIONAL']
    },
    country: {
      type: 'string'
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

// TODO: fix zipLastFound sp in BE schema and update here
export function addressUI(label = 'Address', addressName) {
  const fieldOrder = [
    'type',
    'country',
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'state',
    'militaryStateCode',
    'zipCode',
    'militaryPostOfficeTypeCode'
  ];

  return {
    'ui:title': label,
    'ui:order': fieldOrder,
    'ui:options': {
      updateSchema: (formData, schema) => {
        const currentSchema = _.set(schema);
        const addressType = formData[addressName].type;
        if (
          addressType === 'DOMESTIC' ||
          addressType === 'MILITARY'
        ) {
          currentSchema.properties.country.enum = USAOnly;
        }

        if (addressType === 'INTERNATIONAL') {
          currentSchema.properties.country.enum = countries;
        }
        return currentSchema;
      }
    },
    type: {
      'ui:title': 'Type',
      'ui:options': {
        labels: typeLabels
      }
    },
    country: {
      'ui:title': 'Country'
    },
    addressLine1: {
      'ui:title': 'Street'
    },
    addressLine2: {
      'ui:title': 'Line 2'
    },
    addressLine3: {
      'ui:title': 'Line 3'
    },
    city: {
      'ui:title': 'City'
    },
    state: {
      'ui:title': 'State',
      'ui:options': {
        labels: stateLabels,
        hideIf: formData =>
          !formData[addressName] || formData[addressName].type !== 'DOMESTIC'
      }
    },
    militaryStateCode: {
      'ui:title': 'Military State Code',
      'ui:options': {
        hideIf: formData =>
          !formData[addressName] || formData[addressName].type !== 'MILITARY' // TODO: determine expand under conditions
      }
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:validations': [validateZIP],
      'ui:errorMessages': {
        pattern: 'Please enter a valid 9 digit ZIP code (dashes allowed)'
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        hideIf: formData =>
          !formData[addressName] ||
          formData[addressName].type === 'INTERNATIONAL' // TODO: determine expand under
      }
    },
    militaryPostOfficeTypeCode: {
      'ui:title': 'Military Post Office Type Code',
      'ui:options': {
        labels: militaryPostOfficeTypeLabels,
        hideIf: formData =>
          !formData[addressName] || formData[addressName].type !== 'MILITARY'
      }
    }
  };
}

function createPrimaryAddressPage(formSchema, isReview) {
  const { date } = formSchema.definitions;
  // TODO: create email definition in BE schema

  const uiSchema = {
    mailingAddress: addressUI('Mailing Address', 'mailingAddress'),
    primaryPhone: {
      'ui:title': 'Primary telephone number',
      'ui:widget': SSNWidget, // TODO: determine whether to rename widget
      'ui:validations': [validatePhone],
      'ui:errorMessages': {
        pattern: 'Phone numbers must be at least 10 digits (dashes allowed)'
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large'
      }
    },
    secondaryPhone: {
      'ui:title': 'Primary telephone number',
      'ui:widget': SSNWidget,
      'ui:validations': [validatePhone],
      'ui:errorMessages': {
        pattern: 'Phone numbers must be at least 10 digits (dashes allowed)'
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
      'ui:title': 'This address needs to change soon.'
    },
    forwardingAddress: _.merge(
      addressUI('Forwarding Address', 'forwardingAddress'),
      {
        'ui:options': {
          expandUnder: 'view:hasForwardingAddress'
        }
      }
    ),
    effectiveDate: _.merge(dateUI('Effective date'), {
      'ui:options': {
        expandUnder: 'view:hasForwardingAddress'
      }
    })
  };

  const schema = {
    type: 'object',
    properties: {
      mailingAddress: addressSchema,
      primaryPhone: {
        type: 'string'
      },
      secondaryPhone: {
        type: 'string'
      },
      emailAddress: {
        type: 'string',
        format: 'email'
      }, // TODO: determine whether a secondary email is required as indicated by BE schema
      'view:hasForwardingAddress': {
        type: 'boolean'
      },
      forwardingAddress: addressSchema,
      effectiveDate: date
    }
  };

  const pageConfig = {
    pageTitle: 'Primary address',
    description:
      'Here’s the address we have on file for you. We’ll use this address to mail any important information about your disability claim.',
    initialData,
    isReview,
    component: VerifiedReviewContainer,
    verifiedReviewComponent: PrimaryAddressViewField,
    uiSchema,
    schema
  };

  return getPage(pageConfig, 'Veteran Details');
}

export const createVerifiedPrimaryAddressPage = formConfig =>
  createPrimaryAddressPage(formConfig, true);

export const createUnverifiedPrimaryAddressPage = formConfig =>
  createPrimaryAddressPage(formConfig, false);
