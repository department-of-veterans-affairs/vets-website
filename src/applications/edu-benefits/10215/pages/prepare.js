import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export const prepare = {
  uiSchema: {
    ...titleUI('Prepare to enter your 85/15 calculations'),
    'ui:description': (
      <>
        <p>
          On the next several pages, you will provide all 85/15 calculations for
          your institution. Submit calculations for all approved programs listed
          on your most recent WEAMS-22-1998 Report. List every program and
          iclude calculations, even if a program has a Supported Student or
          Total Enrollment of "0".
        </p>
        <p>
          Review the calculation instructions we provided before proceeding. You
          may find it helpful to open the instructions in a new tab while
          completing the form, making it easier to reference them as you enter
          your calculations.
        </p>
        {/* <a
          target="_blank"
          rel="noopener noreferrer"
          // href=""
        >
          Review the calculation instructions (opens in a new tab)
        </a> */}
      </>
    ),
  },
  schema: {
    // This does still need to be here or it'll throw an error
    type: 'object',
    properties: {}, // The properties can be empty
  },
};
