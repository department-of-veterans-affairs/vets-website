// @ts-check
import React from 'react';
import {
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizingOfficial: {
      ...titleUI(
        'Please provide your institution’s authorizing official information',
        <p>
          <strong>Note:</strong> The person filling out this form must be
          authorized to enter the school or training establishment into a
          binding agreement with the Department of Veterans Affairs as an
          authorizing official.
        </p>,
      ),
      fullName: firstNameLastNameNoSuffixUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      authorizingOfficial: {
        type: 'object',
        properties: {
          fullName: firstNameLastNameNoSuffixSchema,
        },
        required: ['fullName'],
      },
    },
  },
};
