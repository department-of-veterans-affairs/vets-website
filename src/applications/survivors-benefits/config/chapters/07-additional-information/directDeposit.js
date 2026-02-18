import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

// Simple page to collect whether applicant has a bank account for direct deposit
const Description = () => (
  <div>
    <p>
      The Department of Treasury requires all federal benefit payments be made
      by electronic funds transfer (EFT), also called direct deposit. If we
      approve your application, we’ll use direct deposit to deposit your
      payments directly into a bank account.
    </p>
  </div>
);

const BankAdditionalInfo = () => (
  <va-additional-info trigger="What if I don’t have a bank account?">
    <span>
      <p>
        The{' '}
        <va-link
          href="https://veteransbenefitsbanking.org/find-bank-credit-union/"
          text="Veterans Benefits Banking Program (VBBP)"
          external
        />{' '}
        provides a list of Veteran-friendly banks and credit unions. They’ll
        work with you to set up an account, or help you qualify for an account,
        so you can use direct deposit. To get started, call one of the
        participating banks or credit unions listed on the VBBP website. Be sure
        to mention the Veterans Benefits Banking Program.
      </p>
      <p>
        Note: Federal regulation, found in 31 C.F.R. § 208.3 provides that,
        subject to section 208.4, “all Federal payments made by an agency shall
        be made by electronic funds transfer” (EFT).
      </p>
    </span>
  </va-additional-info>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Direct deposit for survivor benefits', Description),
    hasBankAccount: yesNoUI({
      title: 'Do you have a bank account to use for direct deposit?',
      classNames: 'vads-u-margin-top--2',
    }),
    bankAdditionalInfo: {
      'ui:description': BankAdditionalInfo,
    },
  },
  schema: {
    type: 'object',
    required: ['hasBankAccount'],
    properties: {
      hasBankAccount: yesNoSchema,
      bankAdditionalInfo: {
        type: 'object',
        properties: {},
      },
    },
  },
};
