import fullSchema from '../config/schema';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import PeriodOfConfinement from '../components/PeriodOfConfinement';
import { addCheckboxPerNewDisability } from '../utils';

export const uiSchema = {
  'ui:title': 'Prisoner of War (POW)',
  'view:powStatus': {
    'ui:title': 'Have you ever been a POW?',
    'ui:widget': 'yesNo',
  },
  'view:isPOW': {
    'ui:options': {
      expandUnder: 'view:powStatus',
    },
    confinements: {
      'ui:title': ' ',
      'ui:description': 'Please tell us your dates of confinement',
      'ui:options': {
        viewField: PeriodOfConfinement,
        reviewTitle: 'Periods of confinement',
        itemName: 'Period',
      },
      items: dateRangeUI(
        'From',
        'To',
        'Confinement start date must be before end date',
      ),
    },
    powDisabilities: {
      'ui:title': ' ',
      'ui:description':
        'Which of your new conditions was caused or affected by your POW experience?',
      'ui:options': {
        hideIf: formData => !formData['view:newDisabilities'],
        updateSchema: addCheckboxPerNewDisability,
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:powStatus'],
  properties: {
    'view:powStatus': {
      type: 'boolean',
    },
    'view:isPOW': {
      type: 'object',
      properties: {
        confinements: fullSchema.properties.confinements,
        powDisabilities: {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
