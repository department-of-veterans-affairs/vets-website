import React from 'react';

import {
  arrayBuilderItemFirstPageTitleUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { trainingProviderArrayOptions } from '../helpers';

const trainingProviderDetails = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Training provider name and mail address',
      nounSingular: trainingProviderArrayOptions.nounSingular,
      description: (
        <p>
          A training provider is an organization or institution that can provide
          your training sessions for the program.
        </p>
      ),
    }),
    name: textUI({
      title: 'Name of training provider',
      errorMessages: {
        required: 'You must provide a response',
        // pattern: 'You must provide a response',
      },
    }),
    address: addressNoMilitaryUI({
      labels: {
        street2: 'Apartment, or unit number',
        state: 'label change',
      },
      omit: ['street3'],
      required: {
        state: () => true,
      },
    }),
    // first: textUI({
    //   title: 'First name of individual',
    //   errorMessages: {
    //     required: 'You must provide a response',
    //     pattern: 'You must provide a response',
    //   },
    // }),
    // last: textUI({
    //   title: 'Last name of individual',
    //   errorMessages: {
    //     required: 'You must provide a response',
    //     pattern: 'You must provide a response',
    //   },
    // }),
    // title: textUI({
    //   title: 'Title of individual',
    //   errorMessages: {
    //     required: 'You must provide a response',
    //     pattern: 'You must provide a response',
    //   },
    // }),
    // individualAssociationType: radioUI({
    //   title: 'How is this individual associated with your institution?',
    //   errorMessages: { required: 'Please make a selection' },
    //   labels: associationLabels,
    // }),
  },
  schema: {
    type: 'object',
    required: ['name'],
    properties: {
      name: textSchema,
      address: addressNoMilitarySchema({
        omit: ['street3'],
      }),
    },
  },
};

export { trainingProviderDetails };
