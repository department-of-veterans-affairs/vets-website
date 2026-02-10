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
      <va-alert status="info">
        <h4 slot="headline">What to know if you’re on active duty</h4>
        <p>
          If you’re on active duty while enrolled in the program, you will not
          get a Monthly Housing Allowance (MHA) from VA since you will be
          receiving a Basic Allowance for Housing (BAH) from the military.
        </p>
      </va-alert>
    ),
  },

  activeDutyDuringHitechVets: yesNoUI({
    title:
      'Do you expect to be called to active duty while enrolled in this program?',
    errorMessages: { required: 'Select an option' },
  }),
};

const schema = {
  type: 'object',
  properties: {
    'view:activeDutyInfo': { type: 'object', properties: {} },
    activeDutyDuringHitechVets: yesNoSchema,
  },
  required: ['activeDutyDuringHitechVets'],
};

export default { schema, uiSchema };
