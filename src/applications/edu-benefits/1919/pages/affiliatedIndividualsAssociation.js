import React from 'react';

import {
  arrayBuilderItemFirstPageTitleUI,
  textSchema,
  textUI,
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { proprietaryProfitConflictsArrayOptions } from '../helpers';

const associationLabels = {
  va:
    'They are a VA employee who works with, receives services from, or receives compensation from our institution',
  saa:
    'They are a SAA employee who works with or receives compensation from our institution',
};

const noSpaceOnlyPattern = '^(?!\\s*$).+';

const individualPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Individuals affiliated with both your institution and VA or SAA',
      nounSingular: proprietaryProfitConflictsArrayOptions.nounSingular,
      description: (
        <>
          <p>
            Enter information about any individual who is affiliated with your
            institution and is employed by VA or an SAA. This may indicate a
            potential conflict of interest.
          </p>
          <va-additional-info
            trigger="Review guidelines on for-profit school restrictions"
            data-testid="for-profit-guidelines"
          >
            <p>
              VA and SAA employees are prohibited from owning any interest in
              for-profit schools or receiving wages, profits, or services from
              them, unless granted a waiver by the VA confirming no harm to the
              government, Veterans, or eligible individuals.
            </p>
          </va-additional-info>
        </>
      ),
    }),
    first: textUI({
      title: 'First name of individual',
      errorMessages: {
        required: 'You must provide a response',
        pattern: 'You must provide a response',
      },
    }),
    last: textUI({
      title: 'Last name of individual',
      errorMessages: {
        required: 'You must provide a response',
        pattern: 'You must provide a response',
      },
    }),
    title: textUI({
      title: 'Title of individual',
      errorMessages: {
        required: 'You must provide a response',
        pattern: 'You must provide a response',
      },
    }),
    individualAssociationType: radioUI({
      title: 'How is this individual associated with your institution?',
      errorMessages: { required: 'Please make a selection' },
      labels: associationLabels,
    }),
  },
  schema: {
    type: 'object',
    required: ['first', 'last', 'title', 'individualAssociationType'],
    properties: {
      first: { ...textSchema, pattern: noSpaceOnlyPattern },
      last: { ...textSchema, pattern: noSpaceOnlyPattern },
      title: { ...textSchema, pattern: noSpaceOnlyPattern },
      individualAssociationType: {
        ...radioSchema(['va', 'saa']),
      },
    },
  },
};

export { individualPage as affiliatedIndividualsAssociation };
