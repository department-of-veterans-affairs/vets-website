import React from 'react';
import { parse, isValid, format } from 'date-fns';

import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderOptions } from './config';

import { getFullName, getFormatedDate } from '../../../../shared/utils';

export const information = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add a child',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(title => `Child’s ${title}`),
    birthDate: currentOrPastDateUI({
      title: 'Child’s date of birth',
      dataDogHidden: true,
      required: () => true,
    }),
    'ui:duplicateChecks': {
      duplicateModalTitle: () =>
        'This person may already be on your benefits. Add anyway?',
      duplicateModalDescription: ({ itemData }) => (
        <p>
          <strong>{getFullName(itemData?.fullName)}</strong> has a birth date of{' '}
          {getFormatedDate(itemData?.birthDate)} and is already listed on your
          benefits.
        </p>
      ),
      duplicateModalPrimaryButtonText: () => 'No, cancel adding child',

      allowDuplicates: true,
      comparisonType: 'external',
      comparisons: ['birthDate'],
      externalComparisonData: (/* { formData, index, arrayData } */) => {
        /* formData = Full form data
         * index = Current item index
         * arrayData = data gathered from arrayPath based on comparisons
         * return array of array strings for comparison with arrayData
         *
         * [
         *   ['2020-01-01'],
         *   ['2022-01-01'],
         * ];
         */
        return [['2020-02-01'], ['2022-01-01']];
      },
    },
  },

  schema: {
    type: 'object',
    required: ['fullName', 'birthDate'],
    properties: {
      fullName: fullNameNoSuffixSchema,
      birthDate: currentOrPastDateSchema,
    },
  },
};
