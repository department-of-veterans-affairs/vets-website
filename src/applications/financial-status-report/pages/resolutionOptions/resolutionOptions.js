import React from 'react';
import FinancialOverview from '../../components/FinancialOverview';
import DebtRepayment from '../../components/DebtRepayment';

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
          If you are able to make smaller payments on your debt, your payment
          plan can be extended to up to three years.
        </div>
        <p>
          If your request for extended monthly payments is granted, you will
          make smaller payments monthly by offset or direct payments.
        </p>
      </>
    ),
  },
  {
    type: 'Compromise',
    description: (
      <>
        <div>
          If you need to resolve your debt now but can’t pay the full amount,
          you can submit a compromise offer to resolve the debt.
        </div>
        <p>
          If your request for a compromise is granted, you will need to pay the
          compromise balance in full within 30 days.
        </p>
      </>
    ),
  },
];

const renderLabels = () => {
  let labels = null;
  for (let i = 0; i < resolutionOptions.length; i++) {
    labels = {
      ...labels,
      [resolutionOptions[i].type]: (
        <>
          <span className="vads-u-display--block vads-u-font-weight--bold">
            {resolutionOptions[i].type}
          </span>
          <span className="vads-u-display--block vads-u-font-size--sm">
            {resolutionOptions[i].description}
          </span>
        </>
      ),
    };
  }
  return labels;
};

export const uiSchema = {
  financialOverview: {
    'ui:field': FinancialOverview,
  },
  debtRepaymentOptions: {
    'ui:field': DebtRepayment,
  },
  relationship: {
    resolutionType: {
      'ui:title':
        'What type of help do you want for your Post-9/11 GI Bill debt for tuition and fees?',
      'ui:required': () => true,
      'ui:widget': 'radio',
      'ui:options': {
        labels: renderLabels(),
      },
    },
    canAffordToPay: {
      'ui:title': 'How much can you afford to pay monthly on this debt?',
      'ui:options': {
        expandUnder: 'resolutionType',
        expandUnderCondition: 'Extended monthly payments',
      },
    },
    offerToPay: {
      'ui:title':
        'How much do you offer to pay for this debt with a single payment?',
      'ui:options': {
        expandUnder: 'resolutionType',
        expandUnderCondition: 'Compromise',
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    financialOverview: {
      type: 'object',
      properties: {
        income: {
          type: 'string',
        },
      },
    },
    debtRepaymentOptions: {
      type: 'object',
      properties: {
        expenses: {
          type: 'string',
        },
      },
    },
    relationship: {
      type: 'object',
      properties: {
        resolutionType: {
          type: 'string',
          enum: resolutionOptions.map(option => option.type),
        },
        canAffordToPay: {
          type: 'string',
        },
        offerToPay: {
          type: 'string',
        },
      },
    },
  },
};
