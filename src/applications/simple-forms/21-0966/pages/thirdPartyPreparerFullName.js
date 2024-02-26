import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your name',
      <>
        <p>
          If you’re representing a Veteran, or their spouse or child, add your
          name here.
        </p>
        <p>
          <strong>Note:</strong> You must be recognized by VA to make decisions
          or sign for them.
        </p>
      </>,
    ),
    thirdPartyPreparerFullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      thirdPartyPreparerFullName: fullNameNoSuffixSchema,
    },
  },
};
