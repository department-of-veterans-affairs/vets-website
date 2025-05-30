import React from 'react';

import {
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/*
  TODO: verify if hasConflictOfInterest property should be required --
  it's not in the schema, since the number of list items can used to determine if there's any conflict of interest
  but it is a required field in the mockups.
  Is it ok for schema and UI config to be different?
*/

const uiSchema = {
  'ui:title': 'Individuals with a potential conflict of interest',
  hasConflictOfInterest: yesNoUI({
    title:
      'Do you need to report any VA or SAA employees at your institution who may have a potential conflict of interest under this law?',
    required: () => true,
    description: () => (
      <div className="vads-u-margin-top--1">
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
      </div>
    ),
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
