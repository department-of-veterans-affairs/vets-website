import fullSchema from '../config/schema';
import { uiSchema as autoSuggestUiSchema } from 'us-forms-system/lib/js/definitions/autosuggest';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import { treatmentView } from '../content/vaMedicalRecords';
import { queryForFacilities } from '../utils';
import {
  validateMilitaryTreatmentCity,
  validateMilitaryTreatmentState
} from '../validations';
import { USA } from '../constants';

const { vaTreatmentFacilities } = fullSchema.properties;

export const uiSchema = {
  'ui:description':
    'First we’ll ask you about your VA medical records for your claimed disability.',
  'view:vaMedicalRecordsIntro': {
    'ui:title': 'VA medical records',
    'ui:description': 'Please tell where VA treated you for your disability.'
  },
  vaTreatmentFacilities: {
    'ui:options': {
      itemName: 'Facility',
      viewField: treatmentView
    },
    items: {
      treatmentCenterName: autoSuggestUiSchema(
        'Name of VA medical facility',
        queryForFacilities,
        {
          'ui:options': { queryForResults: true, freeInput: true },
          'ui:errorMessages': {
            maxLength: 'Please enter a name with fewer than 100 characters.',
            pattern: 'Please enter a valid name.'
          }
        }
      ),
      treatmentDateRange: dateRangeUI(
        'Date of first treatment (This date doesn’t have to be exact.)',
        'Date of last treatment (This date doesn’t have to be exact.)',
        'Date of last treatment must be after date of first treatment'
      ),
      treatmentCenterAddress: {
        'ui:order': ['country', 'state', 'city'],
        country: {
          'ui:title': 'Country'
        },
        state: {
          'ui:title': 'State',
          'ui:validations': [validateMilitaryTreatmentState],
          'ui:options': {
            expandUnder: 'country',
            expandUnderCondition: USA
          }
        },
        city: {
          'ui:title': 'City',
          'ui:validations': [validateMilitaryTreatmentCity]
        }
      }
    }
  }
};

export const schema = {
  type: 'object',
  properties: {
    'view:vaMedicalRecordsIntro': {
      type: 'object',
      properties: {}
    },
    vaTreatmentFacilities
  }
};
