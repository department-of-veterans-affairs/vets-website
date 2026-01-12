import React from 'react';
import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { merge } from 'lodash';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      () => (
        <>
          <va-alert status="info" slim uswds>
            <p className="vads-u-margin-y--0 vads-u-font-weight--normal">
              Any changes you make will also be reflected in your VA.gov profile
            </p>
          </va-alert>
          <h3>Edit your mailing address</h3>
        </>
      ),
      `We may mail information about your application to the address you provide here.`,
    ),
    applicantMailingAddress: merge(
      {},
      addressNoMilitaryUI({
        omit: ['street3'],
      }),
      {
        city: {
          'ui:title': 'City',
          'ui:options': {
            replaceSchema: (_, schema) => {
              return {
                ...schema,
                pattern: '^(?=.*[A-Za-z])[A-Za-z\\s]+$',
              };
            },
          },
          'ui:errorMessages': {
            pattern: 'Please enter a valid city',
          },
        },
      },
    ),
  },

  schema: {
    type: 'object',
    properties: {
      applicantMailingAddress: merge(
        {},
        addressNoMilitarySchema({
          omit: ['street3'],
        }),
        {
          properties: {
            street: {
              maxLength: 35,
            },
            street2: {
              maxLength: 35,
            },
            city: {
              maxLength: 20,
              pattern: '^(?=.*[A-Za-z])[A-Za-z\\s]+$',
            },
          },
        },
      ),
    },
  },
};
