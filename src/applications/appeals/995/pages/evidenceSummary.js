import {
  validateVaLocation,
  validateVaIssues,
  validateVaFromDate,
  validateVaToDate,
  validateVaUnique,
  validatePrivateName,
  validateCountry,
  validateStreet,
  validateCity,
  validateState,
  validatePostal,
  validatePrivateIssues,
  validatePrivateFromDate,
  validatePrivateToDate,
  validatePrivateUnique,
} from '../validations/evidence';

export default {
  uiSchema: {
    locations: {
      items: {
        'ui:validations': [
          validateVaLocation,
          validateVaIssues,
          validateVaFromDate,
          validateVaToDate,
          validateVaUnique,
        ],
      },
    },
    providerFacility: {
      items: {
        'ui:validations': [
          validatePrivateName,
          validateCountry,
          validateStreet,
          validateCity,
          validateState,
          validatePostal,
          validatePrivateIssues,
          validatePrivateFromDate,
          validatePrivateToDate,
          validatePrivateUnique,
        ],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      locations: {
        type: 'array',
        items: {
          type: 'object',
          required: ['locationAndName', 'issues', 'evidenceDates'],
          properties: {
            locationAndName: {
              type: 'string',
            },
            issues: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'string',
              },
            },
            evidenceDates: {
              type: 'object',
              required: ['from', 'to'],
              properties: {
                from: {
                  type: 'string',
                },
                to: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      providerFacility: {
        type: 'array',
        items: {
          type: 'object',
          required: [
            'providerFacilityName',
            'issues',
            'providerFacilityAddress',
            'treatmentDateRange',
          ],
          properties: {
            providerFacilityName: {
              type: 'string',
            },
            issues: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'string',
              },
            },
            providerFacilityAddress: {
              type: 'object',
              required: ['street', 'city', 'country', 'state', 'postalCode'],
              properties: {
                street: {
                  type: 'string',
                },
                street2: {
                  type: 'string',
                },
                city: {
                  type: 'string',
                },
                state: {
                  type: 'string',
                },
                postalCode: {
                  type: 'string',
                },
                country: {
                  type: 'string',
                },
              },
            },
            treatmentDateRange: {
              type: 'object',
              required: ['from', 'to'],
              properties: {
                from: {
                  type: 'string',
                },
                to: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};
