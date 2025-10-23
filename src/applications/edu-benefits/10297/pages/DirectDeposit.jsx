import React from 'react';
import {
  bankAccountUI,
  bankAccountSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isValidRoutingNumber } from 'platform/forms/validations';
import MaskedBankAccountInfo from '../components/MaskedBankAccountInfo';

const validateRoutingNumber = (errors, routingNumber) => {
  if (!routingNumber) return;
  const cleanValue = routingNumber.toString().replace(/[^\d]/g, '');
  if (!isValidRoutingNumber(cleanValue)) {
    errors.addError('Please enter a valid 9 digit routing number');
  }
};

const bankInfoHelpText = (
  <va-additional-info trigger="What if I don’t have a bank account?">
    <p className="vads-u-margin-bottom--2">
      The{' '}
      <va-link
        external
        href="https://benefits.va.gov/benefits/banking.asp"
        text="Veterans Benefits Banking Program "
      />{' '}
      provides a list of Veteran-friendly banks and credit unions. They’ll work
      with you to set up an account, or help you qualify for an account, so you
      can use direct deposit. To get started, call one of the participating
      banks or credit unions listed on the website. Be sure to mention the
      Veteran Benefits Banking Program.
    </p>
  </va-additional-info>
);

const EligibilityRegulationNote = () => (
  <p>
    Please provide the following information to enroll in direct deposit. Direct
    deposit information is not required to determine eligibility. However,
    benefits cannot be paid without this information per U.S. Treasury
    regulation 31 C.F.R. § 208.3.
  </p>
);

const CheckGuideDetails = () => (
  <>
    <img
      src="/img/direct-deposit-check-guide.svg"
      alt="On a personal check, the bank’s 9-digit routing number is at bottom left; your account number follows it."
    />
    <p>
      Your bank’s routing number is listed along the bottom-left edge of a
      personal check. Your account number is listed to the right of that.
      Routing numbers must be nine digits and account numbers can be up to 17
      digits.
    </p>
  </>
);

export default function createDirectDepositPage() {
  // Base schema/field UI from the pattern
  const baseSchema = bankAccountSchema({ omitBankName: true });
  const baseUIAll = bankAccountUI({ omitBankName: true });

  // Strip out any object-level ui:order/description from the pattern to avoid conflicts
  const {
    // eslint-disable-next-line no-unused-vars
    'ui:order': _dropOrder,
    // eslint-disable-next-line no-unused-vars
    'ui:description': _dropDesc,
    ...baseBankAccountUI
  } = baseUIAll;

  // Build schema with properties in the exact render order you want
  const bankAccountProperties = {
    accountType: baseSchema.properties.accountType,
    'view:checkGuideDetails': { type: 'object', properties: {} },
    routingNumber: baseSchema.properties.routingNumber,
    accountNumber: baseSchema.properties.accountNumber,
    'view:bankInfoHelpText': { type: 'object', properties: {} },
  };

  const schema = {
    type: 'object',
    properties: {
      bankAccount: {
        ...baseSchema,
        properties: bankAccountProperties,
        required: [],
      },
    },
  };

  const uiSchema = {
    ...titleUI('Direct deposit'),
    'ui:description': <EligibilityRegulationNote />,
    bankAccount: {
      // Use the pattern’s field-level config, but WITHOUT its object-level ui:order
      ...baseBankAccountUI,

      // Explicitly null any lingering order from upstream patterns (VRRAP-style)
      'ui:order': null,

      accountType: {
        ...baseBankAccountUI.accountType,
      },

      'view:checkGuideDetails': {
        'ui:field': 'ViewField',
        'ui:description': <CheckGuideDetails />,
      },

      routingNumber: {
        ...baseBankAccountUI.routingNumber,
        'ui:title': 'Bank’s 9-digit routing number',
        'ui:validations': [validateRoutingNumber],
        'ui:webComponentField': MaskedBankAccountInfo,
        'ui:errorMessages': {
          pattern: 'Please enter a valid 9 digit routing number',
        },
      },

      accountNumber: {
        ...baseBankAccountUI.accountNumber,
        'ui:webComponentField': MaskedBankAccountInfo,
      },

      'view:bankInfoHelpText': {
        'ui:field': 'ViewField',
        'ui:description': (
          <>
            <p>
              <strong>Note:</strong> Any bank account information you enter here
              will apply to your other Veteran benefits, including compensation,
              pension, and Benefits for Certain Children with Disabilities
              (Chapter 18) payments.
            </p>
            <p>
              Information entered here won’t change your existing accounts for
              health benefits.
            </p>
            {bankInfoHelpText}
          </>
        ),
      },
    },
  };

  return {
    title: 'Direct deposit',
    path: 'direct-deposit',
    uiSchema,
    schema,
  };
}
