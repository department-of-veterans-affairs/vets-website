import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  repTypeRadio: radioUI({
    title: 'What type of representative are you appointing?',
  }),
};

export const schema = {
  type: 'object',
  required: ['repTypeRadio'],
  properties: {
    repTypeRadio: radioSchema([
      'Veterans Service Organization (VSO)',
      'Attorney',
      'Claims Agent',
    ]),
  },
};
