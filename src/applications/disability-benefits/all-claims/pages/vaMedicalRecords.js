import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import { treatmentView } from '../content/vaMedicalRecords';
import { hasVAEvidence } from '../utils';
import { makeSchemaForAllDisabilities } from '../utils/schemas';
import { isCompletingForm0781 } from '../utils/form0781';

import {
  validateMilitaryTreatmentCity,
  validateMilitaryTreatmentState,
  startedAfterServicePeriod,
  validateBooleanGroup,
} from '../validations';
import { USA } from '../constants';

const { vaTreatmentFacilities } = fullSchema.properties;

export const uiSchema = {
  'view:vaMedicalRecordsIntro': {
    'ui:title': 'VA medical records',
    'ui:description':
      'Tell us where VA treated you for your condition. We’ll use the information you provide to help us locate your records and make decisions on your claim.',
  },
  vaTreatmentFacilities: {
    'ui:options': {
      itemName: 'Facility',
      itemAriaLabel: data => data.treatmentCenterName,
      viewField: treatmentView,
      showSave: true,
      reviewMode: true,
      confirmRemove: true,
      updateSchema: (formData, schema) => ({
        ...schema,
        minItems: hasVAEvidence(formData) ? 1 : 0,
      }),
    },
    items: {
      'ui:order': [
        'treatmentCenterName',
        'treatedDisabilityNames',
        'treatmentLocation0781Related',
        'treatmentDateRange',
        'treatmentCenterAddress',
      ],
      'ui:options': {
        itemAriaLabel: data => data.treatmentCenterName,
      },
      treatmentCenterName: {
        'ui:title': 'Name of VA medical facility',
      },
      treatedDisabilityNames: {
        'ui:title':
          'Choose the conditions you got treatment for at this facility.',
        'ui:webComponentField': VaCheckboxGroupField,
        'ui:options': {
          updateSchema: makeSchemaForAllDisabilities,
          itemAriaLabel: data => data.treatmentCenterName,
          showFieldLabel: true,
        },
        'ui:validations': [validateBooleanGroup],
        'ui:errorMessages': {
          atLeastOne: 'Please select at least one condition',
          required: 'Please select at least one condition',
        },
      },
      treatmentLocation0781Related: {
        ...yesNoUI({
          title:
            'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
        }),
        'ui:options': {
          hideIf: formData => !isCompletingForm0781(formData),
        },
        'ui:required': formData => isCompletingForm0781(formData),
      },
      treatmentDateRange: {
        from: {
          ...dateUI('When did you first visit this facility?'),
          'ui:validations': dateUI()['ui:validations'].concat([
            startedAfterServicePeriod,
          ]),
        },
      },
      treatmentCenterAddress: {
        'ui:order': ['country', 'state', 'city'],
        country: {
          'ui:title': 'Country',
          'ui:autocomplete': 'off',
        },
        state: {
          'ui:title': 'State',
          'ui:autocomplete': 'off',
          'ui:validations': [validateMilitaryTreatmentState],
          'ui:options': {
            expandUnder: 'country',
            expandUnderCondition: USA,
          },
        },
        city: {
          'ui:title': 'City',
          'ui:autocomplete': 'off',
          'ui:validations': [validateMilitaryTreatmentCity],
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:vaMedicalRecordsIntro': {
      type: 'object',
      properties: {},
    },
    vaTreatmentFacilities: {
      ...vaTreatmentFacilities,
      minItems: 0, // fixes validation issue
      items: {
        type: 'object',
        required: ['treatmentCenterName', 'treatedDisabilityNames'],
        properties: {
          treatmentCenterName:
            vaTreatmentFacilities.items.properties.treatmentCenterName,
          treatmentLocation0781Related: {
            type: 'boolean',
            properties: {},
          },
          treatmentDateRange: {
            type: 'object',
            properties: {
              from: {
                $ref: '#/definitions/date',
              },
            },
          },
          treatmentCenterAddress:
            vaTreatmentFacilities.items.properties.treatmentCenterAddress,
          treatedDisabilityNames: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
