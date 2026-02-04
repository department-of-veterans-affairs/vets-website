import React from 'react';

import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  conflictOfInterestPolicy,
  validateConflictOfInterestStartDate,
  validateConflictOfInterestEndDate,
} from '../helpers';

const uiSchema = {
  ...arrayBuilderItemSubsequentPageTitleUI(
    'Information on an individual with a potential conflict of interest who receives VA educational benefits',
  ),
  ...descriptionUI(<>{conflictOfInterestPolicy}</>),
  enrollmentPeriodStart: {
    ...currentOrPastDateUI({
      title: 'Date their enrollment began',
      required: () => true,
      errorMessages: { pattern: 'Enter a valid date' },
    }),
    'ui:validations': [validateConflictOfInterestStartDate],
  },
  enrollmentPeriodEnd: {
    ...currentOrPastDateUI({
      title: 'Date their enrollment ended',
      required: () => false,
      errorMessages: { pattern: 'Enter a valid date' },
    }),
    'ui:validations': [validateConflictOfInterestEndDate],
  },
};

const schema = {
  type: 'object',
  properties: {
    enrollmentPeriodStart: currentOrPastDateSchema,
    enrollmentPeriodEnd: currentOrPastDateSchema,
  },
  required: ['enrollmentPeriodStart'],
};

export { schema, uiSchema };
