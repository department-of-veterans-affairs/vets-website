import React from 'react';

export default {
  uiSchema: {
    'ui:title': (
      <>
        <p className="vads-u-font-size--lg">Organization’s representatives</p>
        <p className="vads-u-margin-top--4 vads-u-margin-bottom--2 vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-color--gray-dark">
          List at least one person from the organization who we can release your
          information to.
        </p>
      </>
    ),
    organizationRepresentative: {
      'ui:title': (
        <div className="vads-u-font-weight--normal vads-u-font-size--base vads-u-margin-bottom--2">
          <span>
            Name of representative{' '}
            <span className="custom-required-span hide-on-review-page">
              (*Required)
            </span>
          </span>
          <br />
          <span className="vads-u-color--gray-medium hide-on-review-page">
            At least one representative is required
          </span>
        </div>
      ),
      'ui:errorMessages': {
        required: 'Please enter the name of a representative',
      },
    },
    organizationRepresentative2: {
      'ui:title': 'Name of second representative (if any)',
    },
  },
  schema: {
    type: 'object',
    required: ['organizationRepresentative'],
    properties: {
      organizationRepresentative: {
        type: 'string',
      },
      organizationRepresentative2: {
        type: 'string',
      },
    },
  },
};
