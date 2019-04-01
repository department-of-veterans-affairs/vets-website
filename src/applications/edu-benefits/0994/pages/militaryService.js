import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import { activeDutyNotice, benefitNotice } from '../content/militaryService';

const { activeDuty, activeDutyDuringVetTec } = fullSchema.properties;

export const uiSchema = {
  activeDuty: {
    'ui:title': 'Are you currently on active duty?',
    'ui:widget': 'yesNo',
  },
  'view:activeDutyNotice': {
    'ui:description': activeDutyNotice,
    'ui:options': {
      expandUnder: 'activeDuty',
      expandUnderCondition: true,
    },
  },
  activeDutyDuringVetTec: {
    'ui:title':
      'Do you expect to be called to active duty while you’re enrolled in a VET TEC program?',
    'ui:widget': 'yesNo',
  },
  'view:benefitNotice': {
    'ui:title': '',
    'ui:description': benefitNotice,
    'ui:options': {
      expandUnder: 'activeDutyDuringVetTec',
      expandUnderCondition: true,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['activeDuty'],
  properties: {
    activeDuty,
    'view:activeDutyNotice': {
      type: 'object',
      properties: {},
    },
    activeDutyDuringVetTec,
    'view:benefitNotice': {
      type: 'object',
      properties: {},
    },
  },
};
