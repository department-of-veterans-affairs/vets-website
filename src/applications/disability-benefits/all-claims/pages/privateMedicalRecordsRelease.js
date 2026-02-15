import _ from 'platform/utilities/data';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { validateDate } from 'platform/forms-system/src/js/validation';
import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  textUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  recordReleaseDescription,
  limitedConsentTitle,
  limitedConsentTextTitle,
  limitedConsentDescription,
} from '../content/privateMedicalRecordsRelease';
import { isCompletingForm0781 } from '../utils/form0781';
import { standardTitle } from '../content/form0781';
import { makeSchemaForAllDisabilities } from '../utils/schemas';
import { isCompletingModern4142 } from '../utils';

import PrivateProviderTreatmentView from '../components/PrivateProviderTreatmentView';

import { validateBooleanGroup } from '../validations';
import PrivateMedicalProvidersConditions from '../components/confirmationFields/PrivateMedicalProvidersConditions';

const { form4142 } = fullSchema.properties;

const {
  providerFacilityName,
} = form4142.properties.providerFacility.items.properties;
const { limitedConsent } = form4142.properties;

export const uiSchema = {
  'ui:title': standardTitle('Request medical records from private providers'),
  'ui:description': recordReleaseDescription,
  'view:limitedConsent': {
    'ui:webComponentField': VaCheckboxField,
    'ui:title': limitedConsentTitle,
  },
  limitedConsent: {
    'ui:title': limitedConsentTextTitle,
    'ui:options': {
      expandUnder: 'view:limitedConsent',
      expandUnderCondition: true,
    },
    'ui:required': formData => _.get('view:limitedConsent', formData, false),
  },
  'view:privateRecordsChoiceHelp': {
    'ui:description': limitedConsentDescription,
  },
  providerFacility: {
    'ui:options': {
      itemName: 'Provider or hospital',
      viewField: PrivateProviderTreatmentView,
      hideTitle: true,
    },
    items: {
      providerFacilityName: textUI({
        title: 'Name of private provider or hospital',
      }),
      treatmentLocation0781Related: {
        ...yesNoUI({
          title:
            'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
        }),
        'ui:options': {
          hideIf: formData => !isCompletingForm0781(formData),
        },
        'ui:required': formData => isCompletingForm0781(formData),
        'ui:confirmationField': value => {
          return {
            data: value.formData ? 'Yes' : 'No',
            label:
              'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
          };
        },
      },
      treatedDisabilityNames: {
        'ui:title': 'What conditions were you treated for?',
        'ui:webComponentField': VaCheckboxGroupField,
        'ui:options': {
          updateSchema: makeSchemaForAllDisabilities,
          itemAriaLabel: data => data.treatmentCenterName,
          showFieldLabel: true,
          hideIf: formData => !isCompletingModern4142(formData),
        },
        'ui:validations': [validateBooleanGroup],
        'ui:errorMessages': {
          atLeastOne: 'Please select at least one condition',
          required: 'Please select at least one condition',
        },
        'ui:required': formData => isCompletingModern4142(formData),
        'ui:confirmationField': PrivateMedicalProvidersConditions,
      },
      'ui:validations': [validateDate],
      treatmentDateRange: currentOrPastDateRangeUI(
        {
          title: 'When did your treatment start?',
          hint: 'You can provide an estimated date',
        },
        {
          title: 'When did your treatment end?',
          hint: 'You can provide an estimated date',
        },
        'End of treatment must be after start of treatment',
      ),
      providerFacilityAddress: (() => {
        const addressUiSchema = addressNoMilitaryUI({
          omit: ['street3'],
          labels: {
            street: 'Street address (20 characters maximum)',
            street2: 'Street address 2 (20 characters maximum)',
          },
        });
        return {
          ...addressUiSchema,
          'ui:title': 'Address of provider or hospital',
          city: {
            ...addressUiSchema.city,
            'ui:options': {
              ...addressUiSchema.city['ui:options'],
              replaceSchema: (formData, schema, _uiSchema, index, path) => {
                const originalSchema = addressUiSchema.city[
                  'ui:options'
                ].replaceSchema(formData, schema, _uiSchema, index, path);
                return {
                  ...originalSchema,
                  title: 'City (30 characters maximum)',
                };
              },
            },
          },
        };
      })(),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    providerFacility: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: [
          'providerFacilityName',
          'treatmentDateRange',
          'providerFacilityAddress',
          'treatmentLocation0781Related',
          'treatedDisabilityNames',
        ],
        properties: {
          providerFacilityName,
          treatmentLocation0781Related: {
            type: 'boolean',
            properties: {},
          },
          treatedDisabilityNames: {
            type: 'object',
            properties: {},
          },
          treatmentDateRange: currentOrPastDateRangeSchema,
          providerFacilityAddress: (() => {
            const addressSchema = addressNoMilitarySchema({
              omit: ['street3'],
            });
            return {
              ...addressSchema,
              properties: {
                ...addressSchema.properties,
                street: {
                  type: 'string',
                  maxLength: 20,
                },
                street2: {
                  type: 'string',
                  maxLength: 20,
                },
                city: {
                  type: 'string',
                  maxLength: 30,
                },
              },
            };
          })(),
        },
      },
    },
    'view:limitedConsent': {
      type: 'boolean',
    },
    limitedConsent,
    'view:privateRecordsChoiceHelp': {
      type: 'object',
      properties: {},
    },
  },
};
