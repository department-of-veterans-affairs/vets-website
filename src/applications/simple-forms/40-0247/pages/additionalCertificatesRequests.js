import React from 'react';

import {
  schema as addressSchema,
  uiSchema as addressUiSchema,
} from 'platform/forms/definitions/address.js';
import definitions from 'vets-json-schema/dist/definitions.json';
import AddlCertsReqViewField from '../components/AddlCertsReqViewField';

export default {
  uiSchema: {
    additionalCertificateRequests: {
      'ui:options': {
        itemName: 'Additional request',
        viewField: AddlCertsReqViewField,
        useDlWrap: true,
        keepInPageOnReview: true,
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        address: addressUiSchema(
          <span className="custom-label">
            Tell us where you’d like us to send additional Presidential Memorial
            Certificates
          </span>,
        ),
        quantity: {
          'ui:title': (
            <span className="custom-label h4">
              How many certificates should we send?
            </span>
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
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalCertificateRequests: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            address: addressSchema({ definitions }, true),
            quantity: {
              type: 'number',
            },
          },
          required: ['address', 'quantity'],
        },
      },
    },
  },
};
