import React from 'react';

const labelText =
  'Is this your first time requesting a Presidential Memorial Certificate?';

/* @type {PageSchema} */
export default {
  uiSchema: {
    requestType: {
      'ui:title': <h3 style={{ display: 'inline' }}>{labelText}</h3>,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          first:
            'Yes, this is my first time requesting a presidential memorial certificate',
          replacement:
            'No, I need to replace a presidential memorial certificate that was incorrect, damaged, or never received',
          copies:
            'No, I’ve requested a presidential memorial certificate before, and I need more copies',
        },
      },
      'ui:errorMessages': {
        required: 'Please select a request type',
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
    required: ['requestType'],
    properties: {
      requestType: {
        type: 'string',
        enum: ['first', 'replacement', 'copies'],
      },
    },
  },
};
