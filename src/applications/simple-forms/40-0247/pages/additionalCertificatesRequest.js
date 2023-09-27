import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from 'platform/forms/definitions/address';

export default {
  uiSchema: {
    additionalAddress: uiSchema(
      () => (
        <>
          <p className="vads-u-font-weight--bold vads-u-font-size--h3">
            Where should we send your additional certificates?
          </p>
          <p>Additional address</p>
        </>
      ),
      false,
    ),
    additionalCopies: {
      // TODO: sync w/ Forgers on pattern refactors, then remove hack below
      'ui:title': (
        <>
          <span className="custom-label h4">
            How many certificates should we send to this address?
          </span>{' '}
          <span className="custom-required">(*Required)</span>
          <br />
          <span className="custom-hint">
            You may request up to 99 certificates
          </span>
        </>
      ),
      'ui:errorMessages': {
        required: 'Please provide the number of certificates you would like',
        minimum:
          'Please raise the number of certificates to at least 1, you can request up to 99',
        maximum:
          'Please lower the number of certificates, you can only request up to 99',
      },
      'ui:reviewField': ({ children }) => (
        <div className="review-row">
          <dt>
            <span className="vads-u-font-size--base">
              How many certificates should we send to your address?
            </span>
          </dt>
          <dd>{children}</dd>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalAddress: schema({ definitions }, true, 'address'),
      additionalCopies: {
        type: 'number',
        minimum: 1,
        maximum: 99,
      },
    },
    required: ['additionalAddress', 'additionalCopies'],
  },
};
