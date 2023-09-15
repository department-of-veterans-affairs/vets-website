import React from 'react';

const labelText =
  'Is this your first time requesting a Presidential Memorial Certificate?';

/* @type {PageSchema} */
export default {
  uiSchema: {
    isFirstRequest: {
      'ui:title': labelText, // yesNo widget doesn't support JSX
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          Y:
            'Yes, this is my first time requesting a presidential memorial certificate',
          N:
            'No, I either need to replace a presidential memorial certificate or request more copies',
        },
      },
      'ui:errorMessages': {
        required: 'Please select whether this is your first request',
      },
      // eslint-disable-next-line react/prop-types
      'ui:reviewField': ({ children }) => (
        <div className="review-row">
          <dt>{labelText}</dt>
          <dd>{children}</dd>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['isFirstRequest'],
    properties: {
      isFirstRequest: {
        type: 'boolean',
      },
    },
  },
};
