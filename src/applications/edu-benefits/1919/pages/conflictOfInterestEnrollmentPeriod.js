import React from 'react';

import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { conflictOfInterestPolicy } from '../helpers';

const uiSchema = {
  ...arrayBuilderItemSubsequentPageTitleUI(
    'Information on an individual with a potential conflict of interest who receives VA educational benefits',
  ),
  ...descriptionUI(<>{conflictOfInterestPolicy}</>),
  enrollmentPeriod: currentOrPastDateRangeUI(
    {
      title: 'Date their enrollment began',
      required: () => true,
      errorMessages: {
        required: 'Please select a date',
      },
    },
    {
      title: 'Date their enrollment ended',
      required: () => false,
    },
  ),
};

const schema = {
  type: 'object',
  properties: {
    enrollmentPeriod: currentOrPastDateRangeSchema,
  },
  required: ['enrollmentPeriod'],
};

export { schema, uiSchema };
