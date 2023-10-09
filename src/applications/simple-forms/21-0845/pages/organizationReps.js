import React from 'react';

const labelString = 'Name of representative';

export default {
  uiSchema: {
    'ui:title': (
      <>
        <h3>Organization’s representatives</h3>
        <span className="vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-line-height--4 vads-u-display--block">
          List at least one person from the organization who we can release your
          information to.
        </span>
      </>
    ),
    organizationRepresentative: {
      'ui:title': (
        <>
          <span>{labelString}</span>{' '}
          <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-color--secondary-dark">
            (*Required)
          </span>
          <br />
          <span className="vads-u-color--gray-medium">
            At least one representative is required
          </span>
        </>
      ),
      'ui:reviewField': ({ children }) => (
        // remove custom required-span & description from
        // review-field label.
        <div className="review-row">
          <dt>{labelString}</dt>
          <dd>{children}</dd>
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
