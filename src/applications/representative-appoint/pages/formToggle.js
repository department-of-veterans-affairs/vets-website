import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  veteranRadio: radioUI({
    title: 'Are you a veteran?',
  }),
  repTypeRadio: radioUI({
    title: 'What type of representative are you appointing?',
  }),
};

export const schema = {
  type: 'object',
  required: ['veteranRadio', 'repTypeRadio'],
  properties: {
    veteranRadio: radioSchema(['Yes', 'No']),
    repTypeRadio: radioSchema([
      'Veterans Service Organization (VSO)',
      'Attorney',
      'Claims Agent',
    ]),
  },
};
