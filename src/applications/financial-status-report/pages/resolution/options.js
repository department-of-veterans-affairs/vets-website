import React from 'react';
import FinancialOverview from '../../components/FinancialOverview';
import ResolutionOptionsTitle from '../../components/ResolutionOptionsTitle';
import DebtRepayment from '../../components/DebtRepayment';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

const resolutionOptions = [
  {
    type: 'Waiver',
    description: (
      <>
        <div>
          If making even smaller monthly payments would cause you financial
          hardship, you can ask us to stop collection on (or “waive”) the debt.
        </div>
        <p>
          If we grant you a waiver for some or all of this debt, you won’t have
          to pay the amount we waived. For education debts, we’ll reduce the
          amount of your remaining education benefit entitlement as part of the
          waiver.
        </p>
      </>
    ),
  },
  {
    type: 'Extended monthly payments',
    description: (
      <>
        <div>
          If you can’t pay back the total amount of your debt now, you can ask
          to make smaller monthly payments for up to 3 years. You can make these
          payments in 1 of 2 ways:
        </div>
        <ul>
          <li>
            <strong>Monthly offsets.</strong> This means we’ll keep part or all
            of your VA benefit payments each month until you’ve paid the full
            debt.
          </li>
          <li>
            <strong>Monthly payment plan.</strong> This means you’ll pay us
            directly each month. You can pay online, by phone, or by mail.
          </li>
        </ul>
      </>
    ),
  },
  {
    type: 'Compromise',
    description: (
      <>
        <div>
          If you don’t get a monthly VA benefit payment and can’t pay monthly,
          you can propose a compromise offer. This means you ask us to accept
          less money than you owe and consider it to be full payment.
        </div>
        <p>
          If we accept your offer, you’ll have to pay the lesser amount within
          30 days.
        </p>
      </>
    ),
  },
];

const isRequired = (formData, option) => {
  let index = 0;
  let selected = '';
  let type = '';
  if (window.location.href.includes('resolution-options')) {
    index = window.location.href.slice(-1);
    selected = formData.selectedDebts[index].resolution.resolutionType;
    type = formData.selectedDebts[index].deductionCode;
  }

  if (selected === option && option === 'Waiver') {
    return type !== '30';
  }
  return selected === option;
};

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
  selectedDebts: {
    items: {
      financialOverview: {
        'ui:field': FinancialOverview,
        'ui:options': {
          hideOnReview: true,
        },
      },
      debtRepaymentOptions: {
        'ui:field': DebtRepayment,
        'ui:options': {
          hideOnReview: true,
        },
      },
      resolutionOptionsTitle: {
        'ui:field': ResolutionOptionsTitle,
        'ui:options': {
          hideOnReview: true,
        },
      },
      resolution: {
        'ui:options': {
          classNames: 'resolution-inputs',
        },
        resolutionType: {
          'ui:title': ' ',
          'ui:widget': 'radio',
          'ui:options': {
            labels: renderLabels(),
          },
        },
        eduWaiver: {
          'ui:options': {
            classNames: 'edu-waiver-checkbox',
            expandUnder: 'resolutionType',
            expandUnderCondition: (selectedOption, formData) => {
              const index = window.location.href.slice(-1);
              const type = formData.selectedDebts[index]?.deductionCode;
              return selectedOption === 'Waiver' && type !== '30';
            },
          },
          waiver: {
            'ui:title':
              'By checking this box, I’m agreeing that I understand how a debt  waiver may affect my VA education benefits. If VA grants me a waiver,  this will reduce any remaining education benefit entitlement I may have.',
            'ui:required': formData => isRequired(formData, 'Waiver'),
            'ui:options': {
              showFieldLabel: true,
            },
          },
          'view:components': {
            'view:waiverNote': {
              'ui:description': (
                <p>
                  Note: If you have questions about this, call us at
                  800-827-0648 (or 1-612-713-6415 from overseas). We’re here
                  Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
                </p>
              ),
            },
          },
        },
        affordToPay: _.merge(
          currencyUI('How much can you afford to pay monthly on this debt?'),
          {
            'ui:options': {
              expandUnder: 'resolutionType',
              expandUnderCondition: 'Extended monthly payments',
              widgetClassNames: 'input-size-3',
            },
            'ui:required': formData =>
              isRequired(formData, 'Extended monthly payments'),
          },
        ),

        offerToPay: _.merge(
          currencyUI(
            'How much do you offer to pay for this debt with a single payment?',
          ),
          {
            'ui:options': {
              expandUnder: 'resolutionType',
              expandUnderCondition: 'Compromise',
              widgetClassNames: 'input-size-3',
            },
            'ui:required': formData => isRequired(formData, 'Compromise'),
          },
        ),
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          financialOverview: {
            type: 'object',
            properties: {},
          },
          debtRepaymentOptions: {
            type: 'object',
            properties: {},
          },
          resolutionOptionsTitle: {
            type: 'object',
            properties: {},
          },
          resolution: {
            type: 'object',
            required: ['resolutionType'],
            properties: {
              resolutionType: {
                type: 'string',
                enum: resolutionOptions.map(option => option.type),
              },
              eduWaiver: {
                type: 'object',
                properties: {
                  waiver: {
                    type: 'boolean',
                  },
                  'view:components': {
                    type: 'object',
                    properties: {
                      'view:waiverNote': {
                        type: 'object',
                        properties: {},
                      },
                    },
                  },
                },
              },
              affordToPay: {
                type: 'number',
              },
              offerToPay: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
