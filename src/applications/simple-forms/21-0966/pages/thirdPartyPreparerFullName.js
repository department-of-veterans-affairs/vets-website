import {
  titleUI,
  titleSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your name',
      <p>
        <b>Note:</b> If you’re a representative who is recognized by the VA to
        make decisions or sign for the Veteran or surviving dependent, you can
        sign this application for them.
      </p>,
    ),
    thirdPartyPreparerFullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      thirdPartyPreparerFullName: fullNameNoSuffixSchema,
    },
  },
};
