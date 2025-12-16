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
      'Presidential Memorial Certificate',
      <div className="description">
        You can get a Presidential Memorial Certificate (PMC) sent to your
        mailing address.
        <br />
        <br />
        <div>
          <a
            href="https://www.va.gov/burials-memorials/memorial-items/presidential-memorial-certificates/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about PMCs (opens in a new tab)
          </a>
        </div>
      </div>,
    ),
    veteranDemoYesNo: yesNoUI({
      title: 'Do you want a Presidential Memorial Certificate?',
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
