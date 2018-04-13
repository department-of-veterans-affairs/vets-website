import _ from 'lodash';
import React from 'react';
import fullSchema36 from 'vets-json-schema/dist/28-8832-schema.json';

import * as address from '../../../common/schemaform/definitions/address';
import SSNWidget from '../../../common/schemaform/widgets/SSNWidget';
import currentOrPastDateUI from '../../../common/schemaform/definitions/currentOrPastDate';
import fullNameUI from '../../../common/schemaform/definitions/fullName';
import ssnUI from '../../../common/schemaform/definitions/ssn';
import { genderLabels } from '../../../common/utils/labels';

import VerifiedReviewContainer from '../components/VerifiedReviewContainer';
import {
  PrimaryAddressViewField,
  getPage,
  VAFileNumberDescription
} from '../helpers';

import initialData from '../../../../../test/disability-benefits/526EZ/schema/initialData';

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

const typeLabels = {
  DOMESTIC: 'Domestic',
  MILITARY: 'Military',
  INTERNATIONAL: 'International'
};

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

const internationalCountries = [
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

const militaryPostOfficeTypeLabels = {
  APO: 'Army Post Office',
  FPO: 'Fleet Post Office',
  DPO: 'Diplomatic Post Office'
};

const USAOnly = ['USA'];

const requiredFields = ['country', 'addressLine1'];

function createPrimaryAddressPage(formSchema, isReview) {
  const uiSchema = {
    primaryAddress: {
      type: {
        'ui:title': 'Type',
        'ui:options': {
          labels: typeLabels
        }
      },
      country: {
        'ui:title': 'Country',
        'ui:options': {
          updateSchema: (formData, schema) => {
            const { primaryAddress } = formData;
            const newSchema = _.set(schema);
            if (primaryAddress.type === 'INTERNATIONAL') {
              newSchema.enum = internationalCountries;
              if (primaryAddress && primaryAddress.country === 'USA') {
                delete formData.primaryAddress.country; // eslint-disable-line no-param-reassign
              }
            }
            if (
              primaryAddress.type === 'DOMESTIC' ||
              primaryAddress.type === 'MILITARY'
            ) {
              newSchema.enum = USAOnly;
              if (primaryAddress && primaryAddress.country !== 'USA') {
                delete formData.primaryAddress.country; // eslint-disable-line no-param-reassign
              }
            }
            return newSchema;
          }
        }
      },
      state: {
        'ui:title': 'State',
        'ui:options': {
          hideIf: ({ primaryAddress }) => {
            return (
              primaryAddress.type === 'INTERNATIONAL' ||
              primaryAddress.type === 'MILITARY'
            );
          }
        }
      }
    },
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
    }
  };
  const schema = {
    type: 'object',
    // required: requiredFields,
    properties: {
      primaryAddress: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            'enum': ['MILITARY', 'DOMESTIC', 'INTERNATIONAL']
          },
          country: {
            type: 'string',
            'enum': ['USA']
          },
          state: {
            type: 'string',
            'enum': states
          }
        }
      },
      primaryPhone: {
        type: 'string'
      },
      secondaryPhone: {
        type: 'string'
      },
      emailAddress: {
        type: 'string',
        format: 'email'
      }
    }
  };
  const pageConfig = {
    pageTitle: 'Address information',
    isReview,
    component: VerifiedReviewContainer,
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
