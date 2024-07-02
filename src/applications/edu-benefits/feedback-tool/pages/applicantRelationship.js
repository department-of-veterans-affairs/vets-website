import {
  emailUI,
  emailSchema,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchema from 'vets-json-schema/dist/FEEDBACK-TOOL-schema.json';
import merge from 'lodash/merge';

const { onBehalfOf } = fullSchema.properties;
const anonymous = 'Anonymous';
/** @type {PageSchema} */
export default {
  uiSchema: {
    onBehalfOf: radioUI({
      title: 'I’m submitting feedback on behalf of...',
      useFormsPattern: 'single',
      labels: {
        Myself: 'Myself',
        'Someone else': 'Someone else',
        Anonymous: 'I want to submit my feedback anonymously',
      },
      descriptions: {
        Myself: 'We’ll only share your name with the school.',
        'Someone else':
          'Your name is shared with the school, not the name of the person you’re submitting feedback for.',
        Anonymous:
          'Anonymous feedback is shared with the school. Your personal information, however, isn’t shared with anyone outside of VA.',
      },
    }),
    anonymousEmail: merge({}, emailUI('Email'), {
      'ui:options': {
        expandUnder: 'onBehalfOf',
        expandUnderCondition: anonymous,
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      onBehalfOf: radioSchema(onBehalfOf.enum),
      anonymousEmail: emailSchema,
    },
    required: ['onBehalfOf'],
  },
};
