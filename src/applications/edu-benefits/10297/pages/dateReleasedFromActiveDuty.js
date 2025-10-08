import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { currentOrPastDateSchema } from '~/platform/forms-system/src/js/web-component-patterns/datePatterns';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';

const uiSchema = {
  ...titleUI('Your active duty release date'),
  dateReleasedFromActiveDuty: {
    'ui:title':
      'Please provide the date you were or will be released from active duty.',
    'ui:webComponentField': VaMemorableDateField,
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'You must provide an answer',
      pattern: 'Please enter a year between 1900 and 2125',
    },
    'ui:options': {
      monthSelect: false,
      hint: 'Enter 2 digits for the month and day and 4 digits for the year.',
      classNames: 'va-memorable-date-field',
    },
  },
  'view:releaseDateNote': {
    'ui:description': (
      <p className="vads-u-margin-top--4" data-testid="static-note">
        <strong>Note:</strong> When we review your application, we may ask for a
        copy of your DD 214 or a certification of your expected release date.
        You can request that certification from your Military Personnel Office.
      </p>
    ),
  },
};

const schema = {
  type: 'object',
  properties: {
    dateReleasedFromActiveDuty: currentOrPastDateSchema,
    'view:releaseDateNote': { type: 'object', properties: {} },
  },
  required: ['dateReleasedFromActiveDuty'],
};

export default { schema, uiSchema };
