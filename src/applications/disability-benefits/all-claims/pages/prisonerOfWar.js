import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import PeriodOfConfinement from '../components/PeriodOfConfinement';
import { addCheckboxPerNewDisability } from '../utils';
import { isWithinServicePeriod } from '../validations';
import { confinementDescription } from '../content/prisonerOfWar';

const confinementUI = dateRangeUI(
  'From',
  'To',
  'Confinement start date must be before end date',
);
confinementUI['ui:validations'].push(isWithinServicePeriod);

export const uiSchema = {
  'ui:title': 'Prisoner of War (POW)',
  'view:powStatus': {
    'ui:title': 'Have you ever been a POW?',
    'ui:widget': 'yesNo',
  },
  'view:isPow': {
    'ui:options': {
      expandUnder: 'view:powStatus',
    },
    confinements: {
      'ui:title': ' ',
      'ui:description': confinementDescription,
      'ui:options': {
        viewField: PeriodOfConfinement,
        reviewTitle: 'Periods of confinement',
        itemName: 'Period',
      },
      items: confinementUI,
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
    'view:isPow': {
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
