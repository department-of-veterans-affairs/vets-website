import fullSchema from '../config/schema';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import PeriodOfConfinement from '../components/PeriodOfConfinement';
import { getPOWDisabilities } from '../utils';
import get from '../../../../platform/utilities/data/get';

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
      'ui:options': {
        viewField: PeriodOfConfinement,
        reviewTitle: 'Periods of confinement',
        itemName: 'Period',
      },
      items: dateRangeUI(
        'Start of confinement',
        'End of confinement',
        'Confinement start date must be before end date',
      ),
    },
    powDisabilities: {
      'ui:title': 'Which of these conditions are related to your POW status?',
      'ui:required': formData => get('view:powStatus', formData, false),
      'ui:options': {
        updateSchema: formData => ({
          enum: getPOWDisabilities(formData),
        }),
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
          type: 'string',
        },
      },
    },
  },
};
