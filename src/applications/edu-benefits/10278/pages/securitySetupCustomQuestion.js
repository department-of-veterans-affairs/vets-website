import React from 'react';
import {
  titleUI,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

// Examples accordion component
const AdditionalInfo = () => (
  <va-additional-info trigger="Examples of security questions">
    <ul>
      <li>What was your high school mascot?</li>
      <li>What is your favorite book?</li>
      <li>What was the first concert you attended?</li>
      <li>What city were you born in?</li>
      <li>What was your first job?</li>
    </ul>
  </va-additional-info>
);

const uiSchema = {
  ...titleUI('Create your own security question and answer'),
  'ui:description': <AdditionalInfo />,
  securityAnswerCreate: {
    question: {
      ...textUI({
        title: 'Security question',
        hint: 'Maximum limit is 100 characters',
        errorMessages: {
          required: 'Please enter a security question',
        },
      }),
    },
    answer: {
      ...textUI({
        title: 'Answer',
        hint: 'Maximum limit is 30 characters',
        errorMessages: {
          required: 'You must provide an answer',
        },
      }),
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    securityAnswerCreate: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          maxLength: 100,
        },
        answer: {
          type: 'string',
          maxLength: 30,
        },
      },
      required: ['question', 'answer'],
    },
  },
};

export { schema, uiSchema };
