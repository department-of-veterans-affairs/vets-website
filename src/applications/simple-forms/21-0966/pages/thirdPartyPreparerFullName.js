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
          If you're an alternate signer, Veteran Service Officer, fiduciary, or
          third-party representative filling this out on behalf of a Veteran,
          add your name here.
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
