import _ from '../../../../platform/utilities/data';
import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import { uiSchema as addressUI } from '../../../../platform/forms/definitions/address';
import {
  disabilityNameTitle,
  recordReleaseDescription,
  limitedConsentTitle,
  limitedConsentTextTitle,
  limitedConsentDescription,
  validateZIP,
} from '../helpers';

import PrivateProviderTreatmentView from '../components/PrivateProviderTreatmentView';
import { validateDate } from 'us-forms-system/lib/js/validation';

const { address } = fullSchema526EZ.definitions;

export const uiSchema = {
  disabilities: {
    items: {
      'ui:description': recordReleaseDescription,
      'ui:title': disabilityNameTitle,
      'view:limitedConsent': {
        'ui:title': limitedConsentTitle,
      },
      limitedConsent: {
        'ui:title': limitedConsentTextTitle,
        'ui:options': {
          expandUnder: 'view:limitedConsent',
          expandUnderCondition: true,
        },
        'ui:required': (formData, index) =>
          _.get(`disabilities.${index}.view:limitedConsent`, formData),
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
          providerFacilityAddress: Object.assign(addressUI('', false), {
            street2: {
              'ui:title': 'Street 2',
            },
            postalCode: {
              'ui:title': 'Postal Code',
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
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    disabilities: {
      type: 'array',
      items: {
        type: 'object',
        required: ['providerFacility'],
        properties: {
          providerFacility: {
            type: 'array',
            minItems: 1,
            maxItems: 100,
            items: {
              type: 'object',
              required: ['providerFacilityName', 'providerFacilityAddress'],
              properties: {
                providerFacilityName: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 100,
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
                providerFacilityAddress: {
                  type: 'object',
                  required: [
                    'street',
                    'city',
                    'country',
                    'state',
                    'postalCode',
                  ],
                  properties: {
                    street: {
                      minLength: 1,
                      maxLength: 20,
                      type: 'string',
                    },
                    street2: {
                      minLength: 1,
                      maxLength: 5,
                      type: 'string',
                    },
                    city: {
                      minLength: 1,
                      maxLength: 30,
                      type: 'string',
                    },
                    postalCode: {
                      minLength: 1,
                      maxLength: 9,
                      type: 'string',
                    },
                    country: {
                      type: 'string',
                      enum: address.properties.country.enum,
                      default: 'USA',
                    },
                    state: {
                      type: 'string',
                      enum: address.properties.state.enum,
                      enumNames: address.properties.state.enumNames,
                    },
                  },
                },
              },
            },
          },
          'view:limitedConsent': {
            type: 'boolean',
          },
          limitedConsent: {
            type: 'string',
          },
          'view:privateRecordsChoiceHelp': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
