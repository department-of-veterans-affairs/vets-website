import React from 'react';

import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-margin-y--0">
        Tell us where we should send the certificate. If you want us to send
        copies to another address, you can add an additional address later in
        this form.
      </h3>
    ),
    // TODO: Customize street2 label if Designer confirms we should
    applicantAddress: addressNoMilitaryUI(),
  },
  schema: {
    type: 'object',
    properties: {
      applicantAddress: addressNoMilitarySchema(),
    },
    required: ['applicantAddress'],
  },
};
