import _ from '../../../../platform/utilities/data';
import merge from 'lodash/merge';
import fullSchema from '../config/schema';
import { uiSchema as autoSuggestUiSchema } from 'us-forms-system/lib/js/definitions/autosuggest';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import { treatmentView } from '../content/vaMedicalRecords';
import { queryForFacilities, addCheckboxPerDisability } from '../utils';
import {
  validateMilitaryTreatmentCity,
  validateMilitaryTreatmentState,
} from '../validations';
import { USA } from '../constants';
import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';

const { vaTreatmentFacilities } = fullSchema.properties;

export const uiSchema = {
  'ui:description':
    'First we’ll ask you about your VA medical records for your claimed disability.',
  'view:vaMedicalRecordsIntro': {
    'ui:title': 'VA medical records',
    'ui:description':
      'Please tell us where VA treated you for your disability.',
  },
  vaTreatmentFacilities: {
    'ui:options': {
      itemName: 'Facility',
      viewField: treatmentView,
    },
    items: {
      'ui:order': [
        'treatmentCenterName',
        'relatedDisabilities',
        'treatmentDateRange',
        'treatmentCenterAddress',
      ],
      treatmentCenterName: autoSuggestUiSchema(
        'Name of VA medical facility',
        queryForFacilities,
        {
          'ui:options': { queryForResults: true, freeInput: true },
          'ui:errorMessages': {
            maxLength: 'Please enter a name with fewer than 100 characters.',
            pattern: 'Please enter a valid name.',
          },
        },
      ),
      relatedDisabilities: {
        'ui:title':
          'Please choose the conditions for which you received treatment at this facility.',
        'ui:options': {
          updateSchema: addCheckboxPerDisability,
          showFieldLabel: true,
        },
        'ui:validations': [validateBooleanGroup],
        'ui:errorMessages': {
          atLeastOne: 'Please select at least one condition',
          required: 'Please select at least one condition',
        },
      },
      treatmentDateRange: dateRangeUI(
        'First date you received treatment for these conditions at this facility (this doesn’t have to be exact).',
        'Last date you received treatment for these conditions at this facility (this doesn’t have to be exact).',
        'Date of last treatment must be after date of first treatment',
      ),
      treatmentCenterAddress: {
        'ui:order': ['country', 'state', 'city'],
        country: {
          'ui:title': 'Country',
        },
        state: {
          'ui:title': 'State',
          'ui:validations': [validateMilitaryTreatmentState],
          'ui:options': {
            expandUnder: 'country',
            expandUnderCondition: USA,
          },
          'ui:required': (formData, index) =>
            _.get(
              `vaTreatmentFacilities.${index}.treatmentCenterAddress.country`,
              formData,
            ) === USA,
        },
        city: {
          'ui:title': 'City',
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
    vaTreatmentFacilities: merge({}, vaTreatmentFacilities, {
      items: {
        required: ['treatmentCenterName', 'relatedDisabilities'],
        properties: {
          relatedDisabilities: {
            type: 'object',
            properties: {},
          },
        },
      },
    }),
  },
};
