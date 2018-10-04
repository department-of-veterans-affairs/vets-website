import fullSchema from '../config/schema';

import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import PeriodOfConfinement from '../components/PeriodOfConfinement';

export const uiSchema = {
  'ui:title': 'Prisoner of War (POW)',
  'view:powStatus': {
    'ui:title': 'Have you ever been a POW?',
    'ui:widget': 'yesNo',
  },
  confinements: {
    'ui:options': {
      viewField: PeriodOfConfinement,
      reviewTitle: 'Periods of confinement',
      expandUnder: 'view:powStatus',
      itemName: 'Period',
    },
    items: dateRangeUI(
      'Start of confinement',
      'End of confinement',
      'Confinement start date must be before end date',
    ),
  },
};

export const schema = {
  type: 'object',
  required: ['view:powStatus'],
  properties: {
    'view:powStatus': {
      type: 'boolean',
    },
    confinements: fullSchema.properties.confinements,
  },
};
