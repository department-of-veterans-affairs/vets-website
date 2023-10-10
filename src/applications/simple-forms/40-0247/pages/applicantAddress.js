import React from 'react';

import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <>
        <h3 className="vads-u-margin-y--0">
          Tell us where we should send the certificate.
        </h3>
        <p className="vads-u-margin-y--0 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
          If you want us to send copies to another address, you can add an
          additional address later in this form.
        </p>
      </>
    ),
    applicantAddress: addressNoMilitaryUI({
      labels: {
        street2: 'Apartment or unit number',
      },
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      applicantAddress: addressNoMilitarySchema({
        omit: ['isMilitary', 'street3'],
      }),
    },
    required: ['applicantAddress'],
  },
};
