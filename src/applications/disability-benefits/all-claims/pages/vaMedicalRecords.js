import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateUI from 'platform/forms-system/src/js/definitions/monthYear';
import { treatmentView } from '../content/vaMedicalRecords';
import { makeSchemaForAllDisabilities } from '../utils/schemas';

import {
  validateMilitaryTreatmentCity,
  validateMilitaryTreatmentState,
  startedAfterServicePeriod,
} from '../validations';
import { USA } from '../constants';

const { vaTreatmentFacilities } = fullSchema.properties;

export const uiSchema = {
  'ui:description':
    'First we’ll ask you about your VA medical records for your claimed disability.',
  'view:vaMedicalRecordsIntro': {
    'ui:title': 'VA medical records',
    'ui:description':
      "Tell us where VA has treated you for your disability. We'll use the information you provide to search for your records",
  },
  vaTreatmentFacilities: {
    'ui:options': {
      itemName: 'Facility',
      itemAriaLabel: data =>
        data.treatmentCenterName || 'Facility name not provided',
      viewField: treatmentView,
      showSave: true,
    },
    items: {
      'ui:order': [
        'treatmentCenterName',
        'treatedDisabilityNames',
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
          'Please choose the conditions for which you received treatment at this facility.',
        'ui:options': {
          updateSchema: makeSchemaForAllDisabilities,
          itemAriaLabel: data => data.treatmentCenterName,
          showFieldLabel: true,
        },
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
        properties: {
          treatmentCenterName:
            vaTreatmentFacilities.items.properties.treatmentCenterName,
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
