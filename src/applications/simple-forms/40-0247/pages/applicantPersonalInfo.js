import React from 'react';

import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-margin-y--0">
        We’ll use this information in case we need to follow up with you about
        the request.
      </h3>
    ),
    applicantFullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      applicantFullName: fullNameNoSuffixSchema,
    },
    required: ['applicantFullName'],
  },
};
