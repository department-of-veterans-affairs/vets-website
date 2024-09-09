import React from 'react';

import { PRIMARY_PHONE, PRIMARY_PHONE_TYPES } from '../../../995/constants';

const primaryPhone = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      [PRIMARY_PHONE]: {
        type: 'string',
        enum: PRIMARY_PHONE_TYPES,
      },
    },
  },

  review: data => ({
    'Primary phone number':
      data['view:primaryPhone'] === null ? (
        <span className="usa-input-error-message">
          No primary phone number selected
        </span>
      ) : (
        data['view:primaryPhone']
      ),
  }),
};

export default primaryPhone;
