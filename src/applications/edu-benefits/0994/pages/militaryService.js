import { serviceDescription, benefitNotice } from '../content/militaryService';

export const uiSchema = {
  'ui:description': serviceDescription,
  activeDuty: {
    'ui:title': 'Are you currently on active duty?',
    'ui:widget': 'yesNo',
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
    activeDutyDuringVetTec: {
      type: 'boolean',
    },
    'view:benefitNotice': {
      type: 'object',
      properties: {},
    },
  },
};
