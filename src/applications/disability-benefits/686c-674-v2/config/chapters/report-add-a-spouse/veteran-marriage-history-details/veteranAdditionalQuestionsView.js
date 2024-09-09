import React from 'react';

export const schema = {
  type: 'object',
  properties: {
    'view:additionalQuestionsMessage': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'view:additionalQuestionsMessage': {
    'ui:description': (
      <p className="vads-u-margin-y--6">
        Now we’ll ask you about each of your former marriages.
      </p>
    ),
    'ui:options': {
      hideOnReview: true,
    },
  },
};
