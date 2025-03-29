import React from 'react';

import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Veteran demographics',
      <div className="description">
        The next few questions are about the Veteran’s race and ethnicity. These
        questions are optional. You don’t need to answer them.
        <br />
        <br />
        We ask these questions for statistical purposes. Your answers won’t
        affect your application.
      </div>,
    ),
    veteranDemoYesNo: yesNoUI({
      title:
        'Do you want to answer the optional questions about the Veteran’s race and ethnicity?',
      errorMessages: {
        required: 'You must provide a response.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranDemoYesNo: yesNoSchema,
    },
    required: ['veteranDemoYesNo'],
  },
};
