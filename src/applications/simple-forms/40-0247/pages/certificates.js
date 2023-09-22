import React from 'react';

const labelText = 'How many certificates should we send to your address?';
export default {
  uiSchema: {
    certificates: {
      // a11y: labels should not have <h?> elements
      // use custom-styling instead
      'ui:title': (
        <>
          <span className="custom-label">{labelText}</span>{' '}
          <span className="custom-required">(*Required)</span>
          <p className="custom-hint hide-following-required-span vads-u-margin-top--4 vads-u-margin-bottom--0">
            You may request up to 99 certificates
          </p>
        </>
      ),
      'ui:errorMessages': {
        required: 'Please provide the number of certificates you would like',
        minimum:
          'Please raise the number to at least 1, you can request up to 99',
        maximum:
          'Please lower the number of requests, you can only request up to 99',
      },
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
    properties: {
      certificates: {
        type: 'number',
        minimum: 1,
        maximum: 99,
      },
    },
    required: ['certificates'],
  },
};
