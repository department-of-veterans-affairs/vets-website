import React from 'react';

import {
  arrayBuilderItemFirstPageTitleUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { trainingProviderArrayOptions } from '../helpers';

const TrainingProviderAdditionalInfo = () => {
  return (
    <va-additional-info
      trigger="What is a training provider?"
      class="vads-u-margin-top--3"
    >
      <p>
        A training provider is an organization or organization that offers a
        short-term, high-tech training program. These programs usually last
        between 6 and 28 weeks. They’re meant to help you build skills that lead
        to a job in areas like coding, cybersecurity, or IT.
      </p>
    </va-additional-info>
  );
};

const trainingProviderDetails = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Training provider name and mail address',
      nounSingular: trainingProviderArrayOptions.nounSingular,
    }),
    name: textUI({
      title: 'Name of training provider',
      errorMessages: {
        required: 'You must provide a response',
        // pattern: 'You must provide a response',
      },
    }),
    'view:trainingProviderInfo': {
      'ui:field': TrainingProviderAdditionalInfo,
    },
    address: addressNoMilitaryUI({
      required: {
        // state: () => true,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['name', 'address'],
    properties: {
      name: textSchema,
      'view:trainingProviderInfo': {
        type: 'object',
        properties: {},
      },
      address: addressNoMilitarySchema({}),
    },
  },
};

export { trainingProviderDetails };
