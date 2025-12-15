import React from 'react';
import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': (
      <div>
        <p>We’ll save your application on every change.</p>
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--4 vads-u-margin-bottom--2">
          Deceased’s mailing address
        </h2>
      </div>
    ),
    address: {
      ...addressUI({
        omit: ['street3'],
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};
