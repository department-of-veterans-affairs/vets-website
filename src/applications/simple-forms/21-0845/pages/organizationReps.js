import React from 'react';

import ArrayField from 'platform/forms-system/src/js/fields/ArrayField';
import OrgRepsViewField from '../components/OrgRepsViewField';

export default {
  uiSchema: {
    'ui:title': (
      <>
        <p className="vads-u-font-size--lg">Organization’s representatives</p>
        <p className="vads-u-margin-top--4 vads-u-margin-bottom--2 vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-color--gray-dark">
          List one or more people from the organization who we can share your
          information with.
        </p>
      </>
    ),
    organizationRepresentatives: {
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
        maxItems: 2, // PDF only has 2 lines for reps
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
