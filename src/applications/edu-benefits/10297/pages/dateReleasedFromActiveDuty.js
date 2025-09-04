import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from '~/platform/forms-system/src/js/web-component-patterns/datePatterns';

import { validateWithin180Days } from '../helpers';

const uiSchema = {
  ...titleUI('Your active duty release date'),
  dateReleasedFromActiveDuty: {
    ...currentOrPastDateUI({
      title:
        'Please provide the date you were or will be released from active duty.',
      errorMessages: { required: 'Please enter a date' },
      hint: null,
    }),
    'ui:validations': [validateWithin180Days],
  },
  'view:releaseDateNote': {
    'ui:description': (
      <p className="vads-u-margin-top--4">
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
