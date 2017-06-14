import _ from 'lodash/fp';

import fullSchemaBurials from 'vets-json-schema/dist/21P-530-schema.json';

// import { transform } from '../helpers';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { relationshipLabels, locationOfDeathLabels } from '../labels.jsx';

import { validateMatch } from '../../common/schemaform/validation';

import * as address from '../../common/schemaform/definitions/address';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import * as personId from '../../common/schemaform/definitions/personId';
import phoneUI from '../../common/schemaform/definitions/phone';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';

const {
  relationship,
  claimantFullName,
  veteranFullName,
  locationOfDeath,
  burialDate,
  deathDate
  // claimantEmail,
  // claimantPhone
} = fullSchemaBurials.properties;

const {
  fullName,
  vaFileNumber,
  ssn,
  date
} = fullSchemaBurials.definitions;

const claimantAddress = {
  type: 'object',
  oneOf: [
    {
      properties: {
        country: {
          type: 'string',
          'enum': [
            'CAN'
          ]
        },
        state: {
          type: 'string',
          'enum': [
            'AB',
            'BC',
            'MB',
            'NB',
            'NF',
            'NT',
            'NV',
            'NU',
            'ON',
            'PE',
            'QC',
            'SK',
            'YT'
          ]
        },
        postalCode: {
          type: 'string',
          maxLength: 10
        }
      }
    },
    {
      properties: {
        country: {
          type: 'string',
          'enum': [
            'MEX'
          ]
        },
        state: {
          type: 'string',
          'enum': [
            'aguascalientes',
            'baja-california-norte',
            'baja-california-sur',
            'campeche',
            'chiapas',
            'chihuahua',
            'coahuila',
            'colima',
            'distrito-federal',
            'durango',
            'guanajuato',
            'guerrero',
            'hidalgo',
            'jalisco',
            'mexico',
            'michoacan',
            'morelos',
            'nayarit',
            'nuevo-leon',
            'oaxaca',
            'puebla',
            'queretaro',
            'quintana-roo',
            'san-luis-potosi',
            'sinaloa',
            'sonora',
            'tabasco',
            'tamaulipas',
            'tlaxcala',
            'veracruz',
            'yucatan',
            'zacatecas'
          ]
        },
        postalCode: {
          type: 'string',
          maxLength: 10
        }
      }
    },
    {
      properties: {
        country: {
          type: 'string',
          'enum': [
            'USA'
          ]
        },
        state: {
          type: 'string',
          'enum': [
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
            'WY'
          ]
        },
        postalCode: {
          type: 'string',
          maxLength: 10
        }
      }
    },
    {
      properties: {
        country: {
          not: {
            type: 'string',
            'enum': [
              'CAN',
              'MEX',
              'USA'
            ]
          }
        },
        state: {
          type: 'string',
          maxLength: 51
        },
        postalCode: {
          type: 'string',
          maxLength: 51
        }
      }
    }
  ],
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
  }
};

const claimantPhone = {
  type: 'string',
  pattern: '^\\d{10}$'
};

const claimantEmail = {
  type: 'string',
  format: 'email'
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/burials',
  trackingPrefix: 'burials-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  disableSave: true,
  title: 'Apply for burial benefits',
  subTitle: 'Form 21P-530',
  defaultDefinitions: {
    fullName,
    vaFileNumber,
    ssn,
    date
  },
  chapters: {
    claimantInformation: {
      title: 'Claimant Information',
      pages: {
        claimantInformation: {
          title: 'Claimant information',
          path: 'claimant-information',
          uiSchema: {
            claimantFullName: fullNameUI,
            relationship: {
              type: {
                'ui:title': 'Relationship to the deceased veteran',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: relationshipLabels
                }
              },
              other: {
                'ui:title': 'Please specify',
                'ui:required': (form) => _.get('relationship.type', form) === 'other',
                'ui:options': {
                  expandUnder: 'type',
                  expandUnderCondition: 'other'
                }
              }
            }
          },
          schema: {
            type: 'object',
            required: ['claimantFullName', 'relationship'],
            properties: {
              claimantFullName,
              relationship
            }
          }
        }
      }
    },
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          title: 'Deceased Veteran information',
          path: 'veteran-information',
          uiSchema: {
            'ui:title': 'Deceased Veteran information',
            veteranFullName: fullNameUI,
            'view:veteranId': personId.uiSchema(
              'veteran',
              'view:veteranId.view:noSSN',
              'I don’t have the Veteran’s Social Security number'
            )
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName,
              'view:veteranId': personId.schema(fullSchemaBurials)
            }
          }

        },
        burialInformation: {
          title: 'Burial information',
          path: 'veteran-information/burial',
          uiSchema: {
            burialDate: currentOrPastDateUI('Date of burial'),
            deathDate: currentOrPastDateUI('Date of death'),
            locationOfDeath: {
              location: {
                'ui:title': 'Where did the Veteran’s death occur?',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: locationOfDeathLabels
                }
              },
              other: {
                'ui:title': 'Please specify',
                'ui:required': (form) => _.get('locationOfDeath.location', form) === 'other',
                'ui:options': {
                  expandUnder: 'location',
                  expandUnderCondition: 'other'
                }
              }
            }
          },
          schema: {
            type: 'object',
            required: ['burialDate', 'deathDate', 'locationOfDeath'],
            properties: {
              burialDate,
              deathDate,
              locationOfDeath
            }
          }
        }
      }
    },
    claimantContactInformation: {
      title: 'Claimant Contact Information',
      pages: {
        claimantContactInformation: {
          title: 'Claimant Contact Information',
          path: 'claimant-contact-information',
          uiSchema: {
            'ui:validations': [
              validateMatch('email', 'view:emailConfirmation')
            ],
            claimantAddress: address.uiSchema('Claimant address'),
            claimantEmail: {
              'ui:title': 'Email address'
            },
            claimantPhone: phoneUI('Claimant phone number')
          },
          schema: {
            type: 'object',
            required: ['claimantAddress', 'claimantEmail', 'claimantPhone'],
            properties: {
              // claimantAddress: address.schema(fullSchemaBurials),
              claimantAddress: address.schema({ definitions: { address: claimantAddress } }, true),
              claimantEmail,
              claimantPhone
            }
          }
        }
      }
    }
  }
};

export default formConfig;
