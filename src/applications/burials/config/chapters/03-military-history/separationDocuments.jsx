import React from 'react';
import SeparationDocumentsPage from '../../../containers/SeparationDocumentsPage';

export default {
  uiSchema: {
    'ui:title': <SeparationDocumentsPage />,
    'view:separationDocuments': {
      'ui:title':
        'Do you want to upload a copy of the Veteran’s DD214 or other separation documents?',
      'ui:widget': 'yesNo',
      'ui:errorMessages': {
        required: 'Select yes or no',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['view:separationDocuments'],
    properties: {
      'view:separationDocuments': {
        type: 'boolean',
        properties: {},
      },
    },
  },
};
