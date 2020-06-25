import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import { housingPaymentInfo } from '../content/activeDuty';

const { isActiveDuty } = fullSchema10203.properties;

export const uiSchema = {
  isActiveDuty: {
    'ui:title':
      'Are you currently on active duty or will you be going on active duty while receiving the Rogers STEM Scholarship?',
    'ui:widget': 'yesNo',
  },
  'view:housingPaymentInfo': {
    'ui:description': housingPaymentInfo,
    'ui:options': {
      hideIf: data => !data?.isActiveDuty,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['isActiveDuty'],
  properties: {
    isActiveDuty,
    'view:housingPaymentInfo': {
      type: 'object',
      properties: {},
    },
  },
};
