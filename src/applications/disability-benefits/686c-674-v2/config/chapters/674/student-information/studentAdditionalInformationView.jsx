import React from 'react';

export const schema = {
  type: 'object',
  properties: {
    'view:studentAdditionalInformationView': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'view:studentAdditionalInformationView': {
    'ui:description': (
      <p className="vads-u-margin-y--6">
        Now we’re going to ask you some follow-up questions about each child
        between ages 18 and 23 who’s in school. We’ll go through them one by
        one.
      </p>
    ),
  },
};
