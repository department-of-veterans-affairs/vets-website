import React from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
  currentOrPastDateSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { validateCurrentOrPastMemorableDate } from 'platform/forms-system/src/js/validation';
import {
  conflictOfInterestPolicy,
  validateConflictOfInterestStartDate,
  validateConflictOfInterestEndDate,
} from '../helpers';

const currentOrPastDateMemorableUI = ({
  title,
  required = () => false,
  errorMessages = {},
} = {}) => ({
  'ui:title': title,
  'ui:webComponentField': VaMemorableDateField,
  'ui:required': required,
  'ui:errorMessages': {
    required: 'Enter a date',
    pattern: errorMessages.pattern || 'Enter a valid date',
  },
  'ui:options': {
    monthSelect: false,
    classNames: 'va-memorable-date-field',
  },
});

const uiSchema = {
  ...arrayBuilderItemSubsequentPageTitleUI(
    'Information on an individual with a potential conflict of interest who receives VA educational benefits',
  ),
  ...descriptionUI(<>{conflictOfInterestPolicy}</>),

  enrollmentPeriodStart: {
    ...currentOrPastDateMemorableUI({
      title: 'Date their enrollment began',
      required: () => true,
      errorMessages: { pattern: 'Enter a valid date' },
    }),
    'ui:validations': [
      validateCurrentOrPastMemorableDate,
      validateConflictOfInterestStartDate,
    ],
  },

  enrollmentPeriodEnd: {
    ...currentOrPastDateMemorableUI({
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
