import _ from 'lodash/fp';

import fullSchema4142 from 'vets-json-schema/dist/21-4142-schema.json';

import PrivateProviderTreatmentView from '../components/PrivateProviderTreatmentView';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from '../../../../platform/forms/definitions/address';

import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import {
  recordReleaseDescription,
  limitedConsentDescription,
  disabilityNameTitle,
  validateZIP,
} from '../helpers';

import { validateDate } from 'us-forms-system/lib/js/validation';

export const uiSchema = {
  'ui:description': recordReleaseDescription,
  'ui:title': disabilityNameTitle,
  limitedConsent: {
    'ui:title':
      'I give consent, or permission, to my doctor to release only records related to [condition].',
  },
  'view:privateRecordsChoiceHelp': {
    'ui:description': limitedConsentDescription,
  },
  providerFacility: {
    'ui:options': {
      itemName: 'Provider',
      viewField: PrivateProviderTreatmentView,
      hideTitle: true,
    },
    items: {
      providerFacilityName: {
        'ui:title': 'Name of private provider or hospital',
        'ui:errorMessages': {
          pattern: 'Provider name must be less than 100 characters.',
        },
      },
      'ui:validations': [validateDate],
      treatmentDateRange: dateRangeUI(
        'Approximate date of first treatment',
        'Approximate date of last treatment',
        'End of treatment must be after start of treatment',
      ),
      providerFacilityAddress: _.merge(addressUI('', false), {
        street: {
          'ui:errorMessages': {
            pattern: 'Street address must be less than 20 characters.',
          },
        },
        street2: {
          'ui:title': 'Street 2',
          'ui:errorMessages': {
            pattern: 'Street address must be less than 20 characters.',
          },
        },
        city: {
          'ui:errorMessages': {
            pattern:
              'Please provide a valid city. Must be at least 1 character.',
          },
        },
        postalCode: {
          'ui:title': 'Postal code',
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
          'ui:validations': [
            {
              validator: validateZIP,
            },
          ],
        },
      }),
      limitedConsent: {
        'ui:title':
          'I give consent, or permission, to my doctor to release only records related to [condition].',
      },
      'view:privateRecordsChoiceHelp': {
        'ui:description': limitedConsentDescription,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    providerFacility: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          providerFacilityName: {
            type: 'string',
            pattern: '^(.{1,100})$',
          },
          treatmentDateRange: {
            type: 'object',
            properties: {
              from: {
                $ref: '#/definitions/date',
              },
              to: {
                $ref: '#/definitions/date',
              },
            },
            required: ['from', 'to'],
          },
          providerFacilityAddress: _.merge(
            addressSchema(fullSchema4142, true),
            {
              properties: {
                street: {
                  minLength: 1,
                  maxLength: 50,
                  type: 'string',
                },
                street2: {
                  minLength: 1,
                  maxLength: 50,
                  type: 'string',
                },
                city: {
                  minLength: 1,
                  maxLength: 51,
                  type: 'string',
                },
                postalCode: {
                  type: 'string',
                },
                country: {
                  type: 'string',
                },
                state: {
                  type: 'string',
                },
              },
            },
          ),
        },
        required: ['providerFacilityName', 'providerFacilityAddress'],
      },
    },
    limitedConsent: {
      type: 'boolean',
    },
    'view:privateRecordsChoiceHelp': {
      type: 'object',
      properties: {},
    },
  },
};
