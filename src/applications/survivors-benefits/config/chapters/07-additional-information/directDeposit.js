import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';

// Simple page to collect whether applicant has a bank account for direct deposit
const Description = () => (
  <div>
    <p>
      The Department of Treasury requires all federal benefit payments be made
      by electronic funds transfer (EFT), also called direct deposit. If we
      approve your application for pension benefits, we’ll use direct deposit to
      deposit your payments directly into a bank account.
    </p>
  </div>
);

const uiSchema = {
  ...titleUI('Direct deposit for survivor benefits', Description),
  hasBankAccount: yesNoUI({
    title: 'Do you have a bank account to use for direct deposit?',
    classNames: 'vads-u-margin-top--2',
  }),
};

const schema = {
  type: 'object',
  required: ['hasBankAccount'],
  properties: {
    hasBankAccount: yesNoSchema,
  },
};

export default {
  uiSchema,
  schema,
};
