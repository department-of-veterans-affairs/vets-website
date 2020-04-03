import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import { housingPaymentInfo } from '../content/activeDuty';
import _ from 'lodash';

const { isActiveDuty } = fullSchema1995.properties;

export const uiSchema = {
  isActiveDuty: {
    'ui:title':
      'Are you currently on active duty or do you anticipate you will be going on active duty?',
    'ui:widget': 'yesNo',
  },
  'view:housingPaymentInfo': {
    'ui:description': housingPaymentInfo,
    'ui:options': {
      hideIf: data => !_.get(data, 'isActiveDuty', false),
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
