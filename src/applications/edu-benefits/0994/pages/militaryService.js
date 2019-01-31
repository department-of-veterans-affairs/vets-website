import { activeDutyNotice, benefitNotice } from '../content/militaryService';

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
      'Do you anticipate you will go on active duty during the VET TEC program?',
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
    activeDuty: {
      type: 'boolean',
    },
    'view:activeDutyNotice': {
      type: 'object',
      properties: {},
    },
    activeDutyDuringVetTec: {
      type: 'boolean',
    },
    'view:benefitNotice': {
      type: 'object',
      properties: {},
    },
  },
};
