import React from 'react';

import {
  schema as addressSchema,
  uiSchema as addressUiSchema,
} from 'platform/forms/definitions/address.js';
import definitions from 'vets-json-schema/dist/definitions.json';

export default {
  uiSchema: {
    additionalAddress: addressUiSchema(
      <span className="custom-label">
        Tell us where you’d like us to send additional Presidential Memorial
        Certificates
      </span>,
    ),
    additionalCopies: {
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
        required: 'Please enter the number of certificates you’d like',
      },
      'ui:reviewField': ({ children }) => (
        <div className="review-row">
          <dt>
            <span className="vads-u-font-weight--bold vads-u-font-size--base">
              Quantity
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
      additionalAddress: addressSchema({ definitions }, true),
      additionalCopies: {
        type: 'number',
        minimum: 1,
        maximum: 99,
      },
    },
  },
};
