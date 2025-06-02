import React from 'react';

import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/*
  TODO: Verify if hasConflictOfInterest property should be required.
  - It's not in the schema, since the number of list items can used to determine if there's any conflict of interest,
  but it is a required field in the mockups.
  - Is it ok for schema and UI config to be different?
*/

const uiSchema = {
  ...titleUI('Individuals with a potential conflict of interest'),
  'ui:description': (
    <>
      <div>
        <p>
          Title 38 U.S.C. 3683 prohibits employees of the Department of Veterans
          Affairs (VA) and the State Approving Agency (SAA) from owning any
          interest in a for-profit educational institution. These employees
          cannot receive wages, salary, dividends, profits, or gifts from
          for-profit schools. The law also prohibits VA employees from receiving
          any services from these schools. The VA may waive these restrictions
          if it determines that no harm will result to the government, Veterans,
          or eligible persons. In the next step, you’ll provide information
          about any VA or SAA employees who may have a conflict under this law.
        </p>
        <p>
          In the next step, you’ll provide information about any VA or SAA
          employees who may have a conflict under this law.
        </p>
      </div>
      <va-alert status="info">
        <p>
          <strong>Note: </strong>
          Each time the information on this form changes, a new submission is
          required.
        </p>
      </va-alert>
    </>
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
