import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import PeriodOfConfinement from '../components/PeriodOfConfinement';
import { claimingNew, formatDate } from '../utils';
import { makeSchemaForNewDisabilities } from '../utils/schemas';
import { isWithinServicePeriod } from '../validations';
import { confinementDescription } from '../content/prisonerOfWar';

const confinementUI = dateRangeUI(
  'From',
  'To',
  'Confinement start date must be before end date',
);
confinementUI['ui:validations'].push(isWithinServicePeriod);

const itemAriaLabel = data =>
  data.from ? `period starting on ${formatDate(data.from)}` : 'period';

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
        itemAriaLabel,
        itemName: 'Period',
      },
      items: {
        ...confinementUI,
        'ui:options': {
          itemAriaLabel,
        },
      },
    },
    powDisabilities: {
      'ui:title': ' ',
      'ui:description':
        'Which of your conditions is connected to your POW experience?',
      'ui:options': {
        hideIf: formData => !claimingNew(formData),
        updateSchema: makeSchemaForNewDisabilities,
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
