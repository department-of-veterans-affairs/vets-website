// @ts-check
import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Institution acknowledgements'),
    'view:whatToExpect': {
      'ui:description': (
        <div>
          <h3>What to expect </h3>
          <p>
            In order for a program to be approved, acknowledgements must be
            initialed by the institution authorizing official acknowledging
            agreement and compliance with the requirements. If your school is
            unable to agree to EFT requirements, programs will not be approved
            for VA benefits.
          </p>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:whatToExpect': {
        type: 'object',
        properties: {},
      },
    },
  },
};
