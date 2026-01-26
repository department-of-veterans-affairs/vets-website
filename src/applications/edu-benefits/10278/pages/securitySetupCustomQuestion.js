import React from 'react';
import {
  titleUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

const noSpaceOnlyPattern = '^(?!\\s*$).+';

// Examples accordion component
const ExamplesAccordion = () => (
  <va-accordion open-single>
    <va-accordion-item header="Examples of security questions">
      <ul>
        <li>What was your high school mascot?</li>
        <li>What is your favorite book?</li>
        <li>What was the first concert you attended?</li>
        <li>What city were you born in?</li>
        <li>What was your first job?</li>
      </ul>
    </va-accordion-item>
  </va-accordion>
);

const uiSchema = {
  ...titleUI('Create your own security question and answer'),
  'ui:description': <ExamplesAccordion />,
  securitySetup: {
    customQuestion: {
      ...textUI({
        title: (
          <>
            Security question (
            <span className="vads-u-color--red">*Required</span>)
          </>
        ),
        hint: 'Maximum limit is 100 characters',
        errorMessages: {
          required: 'Please enter a security question',
          pattern: 'You must provide a response',
        },
      }),
    },
    customAnswer: {
      ...textUI({
        title: (
          <>
            Answer (<span className="vads-u-color--red">*Required</span>)
          </>
        ),
        hint: 'Maximum limit is 30 characters',
        errorMessages: {
          required: 'Please enter an answer',
          pattern: 'You must provide a response',
        },
      }),
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    securitySetup: {
      type: 'object',
      properties: {
        customQuestion: {
          ...textSchema,
          pattern: noSpaceOnlyPattern,
          maxLength: 100,
        },
        customAnswer: {
          ...textSchema,
          pattern: noSpaceOnlyPattern,
          maxLength: 30,
        },
      },
      required: ['customQuestion', 'customAnswer'],
    },
  },
};

export { schema, uiSchema };
