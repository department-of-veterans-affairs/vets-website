// This file to be moved to vets-json-schema repo before form hits production

const serviceBranches = [
  'Air Force',
  'Army',
  'Coast Guard',
  'Marine Corps',
  'National Oceanic and Atmospheric Administration',
  'Navy',
  'Public Health Service'
];

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'APPLICATION FOR DISABILITY BENEFITS',
  type: 'object',
  definitions: {
    phone: {
      type: 'string',
      pattern: '^\\d{10}$'
    },
    address: {
      type: 'object',
      required: [
        'country',
        'city',
        'addressLine1'
      ],
      properties: {
        country: {
          type: 'string',
          'enum': [
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
            'Cape Verde', 'Cayman Islands',
            'Central African Republic',
            'Chad',
            'Chile',
            'China',
            'Colombia',
            'Comoros',
            'Congo, Democratic Republic of',
            'Congo, People\'s Republic of',
            'Costa Rica',
            'Cote d\'Ivoire',
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
            'USA',
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
          ],
          'default': 'USA'
        },
        addressLine1: {
          type: 'string',
          maxLength: 20,
          pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$"
        },
        addressLine2: {
          type: 'string',
          maxLength: 20,
          pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$"
        },
        addressLine3: {
          type: 'string',
          maxLength: 20,
          pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$"
        },
        city: {
          type: 'string',
          maxLength: 30,
          pattern: "^([-a-zA-Z0-9'.#]([-a-zA-Z0-9'.# ])?)+$"
        },
        state: {
          type: 'string',
          'enum': [
            'AL',
            'UM',
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
            'AK',
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
            'MO'
          ],
          enumNames: [
            'Alabama',
            'U.S. Minor Outlying Islands',
            'American Samoa',
            'Arizona',
            'Arkansas',
            'Armed Forces Americas (AA)',
            'Armed Forces Europe (AE)',
            'Armed Forces Pacific (AP)',
            'California',
            'Colorado',
            'Connecticut',
            'Delaware',
            'District Of Columbia',
            'Federated States Of Micronesia',
            'Florida',
            'Georgia',
            'Guam',
            'Hawaii',
            'Idaho',
            'Illinois',
            'Indiana',
            'Iowa',
            'Kansas',
            'Kentucky',
            'Louisiana',
            'Maine',
            'Marshall Islands',
            'Maryland',
            'Massachusetts',
            'Michigan',
            'Minnesota',
            'Mississippi',
            'Alaska',
            'Montana',
            'Nebraska',
            'Nevada',
            'New Hampshire',
            'New Jersey',
            'New Mexico',
            'New York',
            'North Carolina',
            'North Dakota',
            'Northern Mariana Islands',
            'Ohio',
            'Oklahoma',
            'Oregon',
            'Palau',
            'Pennsylvania',
            'Puerto Rico',
            'Rhode Island',
            'South Carolina',
            'South Dakota',
            'Tennessee',
            'Texas',
            'Utah',
            'Vermont',
            'Virgin Islands',
            'Virginia',
            'Washington',
            'West Virginia',
            'Wisconsin',
            'Wyoming',
            'Philippine Islands',
            'Missouri'
          ]
        },
        zipCode: {
          type: 'string',
          pattern: '^\\d{5}(?:([-\\s]?)\\d{4})?$'
        }
      }
    },
    date: {
      pattern: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
      type: 'string'
    },
    dateRangeAllRequired: {
      type: 'object',
      properties: {
        from: {
          $ref: '#/definitions/date'
        },
        to: {
          $ref: '#/definitions/date'
        }
      },
      required: [
        'from',
        'to'
      ]
    }
  },
  properties: {
    alternateNames: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: ['first', 'last'],
        properties: {
          first: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          },
          middle: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          },
          last: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          }
        }
      }
    },
    serviceInformation: {
      type: 'object',
      required: ['servicePeriods'],
      properties: {
        servicePeriods: {
          type: 'array',
          minItems: 1,
          maxItems: 100,
          items: {
            type: 'object',
            required: ['serviceBranch', 'dateRange'],
            properties: {
              serviceBranch: {
                type: 'string',
                'enum': [
                  'Air Force',
                  'Air Force Reserve',
                  'Air National Guard',
                  'Army',
                  'Army National Guard',
                  'Army Reserve',
                  'Coast Guard',
                  'Coast Guard Reserve',
                  'Marine Corps',
                  'Marine Corps Reserve',
                  'NOAA',
                  'Navy',
                  'Navy Reserve',
                  'Public Health Service'
                ]
              },
              dateRange: {
                $ref: '#/definitions/dateRangeAllRequired'
              }
            }
          }
        },
        reservesNationalGuardService: {
          type: 'object',
          required: ['unitName', 'obligationTermOfServiceDateRange', 'waiveVABenefitsToRetainTrainingPay'],
          properties: {
            unitName: {
              type: 'string',
              maxLength: 256,
              pattern: "^([a-zA-Z0-9\\-'.#][a-zA-Z0-9\\-'.# ]?)*$"
            },
            unitAddress: {
              $ref: '#/definitions/address'
            },
            unitPhone: {
              $ref: '#/definitions/phone'
            },
            obligationTermOfServiceDateRange: {
              $ref: '#/definitions/dateRangeAllRequired'
            },
            receivingTrainingPay: {
              type: 'boolean',
            },
            title10Activation: {
              type: 'object',
              properties: {
                title10ActivationDate: {
                  $ref: '#/definitions/date'
                },
                anticipatedSeparationDate: {
                  $ref: '#/definitions/date'
                },
              }
            }
          }
        }
      }
    },
    confinements: {
      type: 'array',
      minItems: 1,
      items: {
        $ref: '#/definitions/dateRangeAllRequired'
      }
    },
    militaryRetiredPayBranch: {
      type: 'string',
      'enum': serviceBranches
    },
    waiveRetirementPay: {
      type: 'boolean'
    },
    separationPayDate: {
      type: 'string'
    },
    separationPayBranch: {
      type: 'string',
      'enum': serviceBranches
    },
    waiveTrainingPay: {
      type: 'boolean'
    },
    disabilities: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: ['name', 'disabilityActionType'],
        properties: {
          name: {
            type: 'string'
          },
          disabilityActionType: {
            type: 'string',
            'enum': ['NONE', 'NEW', 'SECONDARY', 'INCREASE', 'REOPEN']
          },
          ratedDisabilityId: {
            type: 'string'
          },
          ratingDecisionId: {
            type: 'string'
          },
          diagnosticCode: {
            type: 'number'
          },
          classificationCode: {
            type: 'string'
          },
          secondaryDisabilities: {
            type: 'array',
            maxItems: 100,
            items: {
              type: 'object',
              required: [
                'name',
                'disabilityActionType'
              ],
              properties: {
                name: {
                  type: 'string'
                },
                disabilityActionType: {
                  type: 'string',
                  'enum': ['NONE', 'NEW', 'SECONDARY', 'INCREASE', 'REOPEN']
                },
                ratedDisabilityId: {
                  type: 'string'
                },
                ratingDecisionId: {
                  type: 'string'
                },
                diagnosticCode: {
                  type: 'number'
                },
                classificationCode: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  }
};

export default schema;
