import React from 'react';

import ArrayField from 'platform/forms-system/src/js/fields/ArrayField';
import OrgRepsViewField from '../components/OrgRepsViewField';

export default {
  uiSchema: {
    'ui:title': (
      <h3 className="custom-header">Organization’s representatives</h3>
    ),
    organizationRepresentatives: {
      'ui:description':
        'List one or more people from the organization who we can share your information with.',
      'ui:field': ArrayField,
      'ui:options': {
        itemName: 'representative',
        viewField: OrgRepsViewField,
        keepInPageOnReview: true,
        useDlWrap: true,
        showSave: false,
        reviewMode: true,
        customTitle: ' ',
        confirmRemove: true,
        confirmRemoveDescription:
          'This will remove the Representative associated with the Organization.',
      },
      items: {
        representativeName: {
          'ui:title': 'Name of representative',
          'ui:required': () => true,
          'ui:errorMessages': {
            required: 'Please provide the Representative’s name',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['organizationRepresentatives'],
    properties: {
      organizationRepresentatives: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            representativeName: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
