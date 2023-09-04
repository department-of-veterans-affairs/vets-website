import React from 'react';

const additionalInfoRequest = {
  uiSchema: {
    'ui:title': ' ',
    'view:additionalInfo': {
      'ui:title': (
        <h1 className="vads-u-margin-y--0 vads-u-display--inline">
          Do you want to write or upload additional information about your
          disagreements?
        </h1>
      ),
      'ui:widget': 'yesNo',
      'ui:options': {
        enableAnalytics: true,
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      'view:additionalInfo': {
        type: 'boolean',
      },
    },
  },

  review: data => ({
    'Do you want to write or upload additional information about your disagreements?': data[
      'view:additionalInfo'
    ]
      ? 'Yes'
      : 'No',
  }),
};

export default additionalInfoRequest;
