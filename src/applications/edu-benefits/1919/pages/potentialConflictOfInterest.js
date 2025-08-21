import React from 'react';

import {
  descriptionUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { alert } from '../helpers';

const uiSchema = {
  ...titleUI('Individuals with a potential conflict of interest'),
  ...descriptionUI(
    <>
      <div data-testid="instructions">
        <p>
          Title 38 U.S.C. 3638 prohibits employees of the Department of Veterans
          Affairs (VA) and the State Approving Agency (SAA) from owning any
          interest in a for-profit educational institution. These employees
          cannot receive wages, salary, dividends, profits, or gifts from
          for-profit schools. The law also prohibits VA employees from receiving
          any services from these schools. The VA may waive these restrictions
          if it determines that no harm will result to the government, Veterans,
          or eligible persons.
        </p>
        <p>
          In the next step, you’ll provide information about any VA or SAA
          employees who may have a conflict under this law.
        </p>
      </div>
      {alert}
    </>,
  ),
  hasConflictOfInterest: yesNoUI({
    title:
      'Do you need to report any VA or SAA employees at your institution who may have a potential conflict of interest under this law?',
    required: () => true,
    errorMessages: {
      required: 'Please make a selection',
    },
  }),
};

const schema = {
  type: 'object',
  properties: {
    hasConflictOfInterest: yesNoSchema,
  },
  required: ['hasConflictOfInterest'],
};

export { schema, uiSchema };
