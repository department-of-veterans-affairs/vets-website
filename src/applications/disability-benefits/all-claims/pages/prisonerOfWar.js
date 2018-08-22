import fullSchema from '../config/schema';

import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import set from '../../../../platform/utilities/data/set';

import PeriodOfConfinement from '../components/PeriodOfConfinement';

export const uiSchema = {
  'view:powStatus': {
    'ui:title': 'Have you ever been a POW?',
    'ui:widget': 'yesNo'
  },
  prisonerOfWar: {
    'ui:options': {
      viewField: PeriodOfConfinement,
      reviewTitle: 'Periods of confinement',
      expandUnder: 'view:powStatus',
      itemName: 'Period'
    },
    items: set('ui:options.expandUnder', 'view:powStatus', dateRangeUI(
      'Start of confinement',
      'End of confinement',
      'Confinement start date must be before end date'
    ))
  }
};

export const schema = {
  type: 'object',
  properties: {
    'view:powStatus': {
      type: 'boolean'
    },
    prisonerOfWar: fullSchema.properties.prisonerOfWar
  }
};

