import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Active duty status during program'),

  'view:activeDutyInfo': {
    'ui:description': (
      <va-alert status="info" class="vads-u-margin-top--4">
        <h4>What to know if you’re on active duty</h4>
        <p>
          If you’re on active duty while enrolled in the program, it does not
          make you ineligible, it just means that you would not get housing
          allowance from the VA since it’s already covered by your service
          branch.
        </p>
      </va-alert>
    ),
  },

  hasCompletedActiveDuty: yesNoUI({
    title:
      'Do you expect to be called to active duty while enrolled in a High Technology Veterans Education, Training and Skills (HITECH VETS) Program?',
    errorMessages: { required: 'Select an option' },
  }),
};

const schema = {
  type: 'object',
  properties: {
    'view:activeDutyInfo': { type: 'object', properties: {} },
    hasCompletedActiveDuty: yesNoSchema,
  },
  required: ['hasCompletedActiveDuty'],
};

export default { schema, uiSchema };
