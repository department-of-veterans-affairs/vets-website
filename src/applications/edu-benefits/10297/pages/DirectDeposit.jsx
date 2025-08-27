import React from 'react';
import {
  bankAccountUI,
  bankAccountSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isValidRoutingNumber } from 'platform/forms/validations';
import MaskedBankAccountInfo from '../components/MaskedBankAccountInfo';

const validateRoutingNumber = (errors, routingNumber) => {
  if (!routingNumber) {
    return;
  }
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
    Direct deposit information is not required to determine eligibility.
    However, benefits cannot be paid without this information per U.S. Treasury
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
  const baseSchema = bankAccountSchema({ omitBankName: true });

  const schema = {
    type: 'object',
    properties: {
      bankAccount: {
        type: 'object',
        required: baseSchema.required,
        properties: {
          ...baseSchema.properties,
          'view:checkGuideDetails': { type: 'object', properties: {} },
          'view:bankInfoHelpText': { type: 'object', properties: {} },
        },
      },
    },
  };

  const baseUI = bankAccountUI({ omitBankName: true });
  const baseUIWithoutDesc = { ...baseUI };
  delete baseUIWithoutDesc['ui:description'];

  const uiSchema = {
    ...titleUI('Direct deposit'),
    'ui:description': <EligibilityRegulationNote />,
    bankAccount: {
      ...baseUIWithoutDesc,
      'ui:order': [
        'accountType',
        'view:checkGuideDetails',
        'routingNumber',
        'accountNumber',
        'view:bankInfoHelpText',
      ],
      accountType: {
        ...baseUIWithoutDesc.accountType,
        'ui:errorMessages': { required: 'Select an account type' },
      },

      'view:checkGuideDetails': {
        'ui:description': <CheckGuideDetails />,
      },

      routingNumber: {
        ...baseUIWithoutDesc.routingNumber,
        'ui:title': 'Bank’s 9-digit routing number',
        'ui:webComponentField': MaskedBankAccountInfo,
        'ui:validations': [validateRoutingNumber],
        'ui:errorMessages': {
          required: 'Enter a 9-digit routing number',
          pattern: 'Please enter a valid 9 digit routing number',
        },
      },
      accountNumber: {
        ...baseUIWithoutDesc.accountNumber,
        'ui:webComponentField': MaskedBankAccountInfo,
        'ui:errorMessages': { required: 'Enter your account number' },
      },
      'view:bankInfoHelpText': {
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
