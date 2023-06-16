import React from 'react';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">
          Your installment contracts and other debts
        </h3>
      </legend>
    </>
  ),
  'ui:options': {
    classNames: 'repayments',
  },
  questions: {
    hasRepayments: {
      'ui:title':
        'Do you make monthly payments on any installments contracts or other debts you make monthly payments on?',
      'ui:required': () => true,
      'ui:description': () => (
        <>
          <div className="vads-u-margin-y--2">
            Examples include:
            <ul>
              <li>Medical bills</li>
              <li>Student loans</li>
              <li>Auto loans</li>
              <li>Home loans</li>
              <li>Personal debts</li>
            </ul>
          </div>
        </>
      ),
      'ui:widget': 'yesNo',
      'ui:options': {
        showFieldLabel: 'label',
      },
      'ui:errorMessages': {
        required:
          'Please provide your installment contracts or other debts information.',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasRepayments: {
          type: 'boolean',
        },
      },
    },
  },
};
