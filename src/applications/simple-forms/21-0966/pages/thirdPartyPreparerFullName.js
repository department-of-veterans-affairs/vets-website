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
      <span>
        If you’re representing a Veteran, or their spouse or child, add your
        name here. <br />
        <br />
        <b>Note:</b> You must be recognized by VA to make decisions or sign for
        them.
      </span>,
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
