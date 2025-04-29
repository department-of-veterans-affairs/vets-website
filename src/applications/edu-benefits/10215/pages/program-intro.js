import React from 'react';
import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const ProgramIntro = {
  uiSchema: {
    ...titleUI('Prepare to enter your 85/15 calculations'),
    ...descriptionUI(
      <>
        <p>
          On the next several pages, you will provide all 85/15 calculations for
          your institution. Submit calculations for all approved programs listed
          on your most recent WEAMS-22-1998 Report. List every program and
          include calculations, even if a program has a Supported Student or
          Total Enrollment of "0".
        </p>
        <p>
          Review the calculation instructions we provided before proceeding. You
          may find it helpful to open the instructions in a new tab while
          completing the form, making it easier to reference them as you enter
          your calculations.
        </p>
        <va-link
          external
          href="/school-administrators/85-15-rule-enrollment-ratio/calculation-instructions"
          text="Review the calculation instructions"
        />
      </>,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export { ProgramIntro };
