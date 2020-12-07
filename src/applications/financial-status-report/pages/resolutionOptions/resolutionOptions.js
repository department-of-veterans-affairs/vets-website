import React from 'react';

const resolutionOptions = [
  {
    type: 'Waiver',
    description: (
      <>
        <div>
          If any monthly payment will create financial hardship for you or your
          family, you can request that your debt be waived.This will reduce your
          remaining education benefits entitlement.
        </div>
        <p>
          If your request for waiver is granted, some or all of your debt will
          be forgiven and your balance reduced.
        </p>
      </>
    ),
  },
  {
    type: 'Extended monthly payments',
    description: (
      <>
        <div>
          If any monthly payment will create financial hardship for you or your
          family, you can request that your debt be waived.This will reduce your
          remaining education benefits entitlement.
        </div>
        <p>
          If your request for waiver is granted, some or all of your debt will
          be forgiven and your balance reduced.
        </p>
      </>
    ),
  },
  {
    type: 'Compromise',
    description: (
      <>
        <div>
          If any monthly payment will create financial hardship for you or your
          family, you can request that your debt be waived.This will reduce your
          remaining education benefits entitlement.
        </div>
        <p>
          If your request for waiver is granted, some or all of your debt will
          be forgiven and your balance reduced.
        </p>
      </>
    ),
  },
];

const FinancialOverview = () => {
  return (
    <>
      <h4>Your financial overview</h4>
      <div className="usa-alert usa-alert-info background-color-only claims-alert-status">
        <div>Total income: $3,000.00</div>
        <div>Total expenses: $2,800.00</div>
        <div>Discretionary income: $200.00</div>
      </div>
    </>
  );
};

const DebtRepaymentOptions = () => {
  return (
    <>
      <h4>Debt repayment options (1 of 3)</h4>
      <div className="va-growable-background">
        <h4>Post-9/11 GI Bill debt for tuition and fees</h4>
        <span>Updated on July 12, 2020</span>
        <p>
          <strong>Amount owed: </strong>
          $9,525.00
        </p>
        <p>
          <strong>Status: </strong>
          First debt notification sent
        </p>
        <p>
          <strong>Date of first notice: </strong>
          July 12, 2020
        </p>
      </div>
    </>
  );
};

export const uiSchema = {
  financialOverview: {
    'ui:title': ' ',
    'ui:field': FinancialOverview,
  },
  debtRepaymentOptions: {
    'ui:title': ' ',
    'ui:field': DebtRepaymentOptions,
  },
  resolutionOptions: {
    resolutionType: {
      'ui:title':
        'What type of help do you want for your Post-9/11 GI Bill debt for tuition and fees?',
      'ui:widget': 'radio',
      'ui:required': () => true,
      'ui:options': {
        labels: {
          [resolutionOptions[0].type]: (
            <>
              <span className="vads-u-display--block vads-u-font-weight--bold">
                {resolutionOptions[0].type}
              </span>
              <span className="vads-u-display--block vads-u-font-size--sm">
                {resolutionOptions[0].description}
              </span>
            </>
          ),
          [resolutionOptions[1].type]: (
            <>
              <span className="vads-u-display--block vads-u-font-weight--bold">
                {resolutionOptions[1].type}
              </span>
              <span className="vads-u-display--block vads-u-font-size--sm">
                {resolutionOptions[1].description}
              </span>
            </>
          ),
          [resolutionOptions[2].type]: (
            <>
              <span className="vads-u-display--block vads-u-font-weight--bold">
                {resolutionOptions[2].type}
              </span>
              <span className="vads-u-display--block vads-u-font-size--sm">
                {resolutionOptions[2].description}
              </span>
            </>
          ),
        },
      },
    },
    canAffordToPay: {
      'ui:title': 'How much can you afford to pay monthly on this debt?',
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    financialOverview: {
      type: 'string',
    },
    debtRepaymentOptions: {
      type: 'string',
    },
    resolutionOptions: {
      type: 'object',
      properties: {
        resolutionType: {
          type: 'string',
          enum: resolutionOptions.map(option => option.type),
        },
        canAffordToPay: {
          type: 'string',
        },
      },
    },
  },
};
