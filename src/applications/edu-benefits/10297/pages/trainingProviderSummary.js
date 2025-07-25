import React from 'react';

import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { trainingProviderArrayOptions } from '../helpers';

const uiSchema = {
  'view:introduction': {
    ...titleUI('Tell us about your training provider'),
    'ui:description': (
      <>
        <div data-testid="instructions">
          <p>
            A training provider is an organization or organization that offers a
            short-term, high-tech training program. These programs usually last
            between 6 and 28 weeks. They’re meant to help you build skills that
            lead to a job in areas like coding, cybersecurity, or IT.
          </p>
          <p>
            You don’t have to list a training provider when you apply. If you
            do, and that provider isn’t approved yet, VA may contac them to see
            if they want to join the program.
          </p>
          <p>
            If you would like to add a training provider, be prepared to answer
            questions outlined below. You may add up to 4 training providers.
          </p>
          <p>
            <strong>You’ll be asked to provide:</strong>
          </p>
          <ul>
            <li>
              The name of the institution or organization that you wish to
              provide your training <strong>and</strong>
            </li>
            <li>The current mail address of your training provider</li>
          </ul>
        </div>
      </>
    ),
    'ui:options': {
      hideIf: formData => formData?.trainingProvider?.length > 0,
    },
  },
  'view:summary': arrayBuilderYesNoUI(trainingProviderArrayOptions, {
    title: 'Do you have a training provider to add?',
    labels: {
      Y: 'Yes, I have a training provider to add.',
      N: 'No, I do not have a training provider to add.',
    },
    hint: () =>
      'Select yes if you would like to add a training provider. You can add up to 4.',
    errorMessages: {
      required: 'Select yes if you have a training provider to add.',
    },
  }),
};
const schema = {
  type: 'object',
  properties: {
    'view:introduction': {
      type: 'object',
      properties: {},
    },
    'view:summary': arrayBuilderYesNoSchema,
  },
  required: ['view:summary'],
};

export { schema, uiSchema };
