import React from 'react';
import FinancialOverview from '../../components/FinancialOverview';
// import ResolutionOptionsTitle from '../../components/ResolutionOptionsTitle';
// import DebtRepayment from '../../components/DebtRepayment';
import ResolutionDebtCard from '../../components/ResolutionDebtCard';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

// const isRequired = (formData, option) => {
//   let index = 0;
//   let selected = '';
//   let type = '';
//   if (window.location.href.includes('resolution-options')) {
//     index = window.location.href.slice(-1);
//     selected = formData.selectedDebts[index]?.resolution.resolutionType;
//     type = formData.selectedDebts[index]?.deductionCode;
//   }

//   if (selected === option && option === 'Waiver') {
//     return type !== '30';
//   }
//   return selected === option;
// };

export const uiSchema = {
  financialOverview: {
    'ui:field': FinancialOverview,
    'ui:options': {
      hideOnReview: true,
    },
  },
  // debtRepaymentOptions: {
  //   'ui:field': DebtRepayment,
  //   'ui:options': {
  //     hideOnReview: true,
  //   },
  // },
  // resolutionOptionsTitle: {
  //   'ui:field': ResolutionOptionsTitle,
  //   'ui:options': {
  //     hideOnReview: true,
  //   },
  // },
  availableOptions: {
    'ui:title': 'Resolution options available:',
    'ui:description': () => (
      <ul>
        <li>
          <strong>Waiver: </strong>
          If we accept your request, we will stop collection on and forgive (or
          “waive”) the debt.
        </li>
        <li>
          <strong>Extended monthly payments: </strong>
          If we accept your request, you can make smaller monthly payments for
          up to 5 years with either monthly offsets or monthly payment plan.
        </li>
        <li>
          <strong>Compromise: </strong>
          If you’re unable to either pay the debt in full or make smaller
          monthly payments, we can consider a smaller one-time payment to
          resolve your debt.
        </li>
      </ul>
    ),
    'ui:options': {
      hideOnReview: true,
    },
  },
  resolution: {
    // 'ui:field': props => {
    //   // const { ObjectField } = props.registry.fields;
    //   // console.log('props: ', props);
    //   return <ResolutionDebtCard {...props} />;
    // },
    // 'ui:field': ResolutionDebtCard,

    'ui:field': ResolutionDebtCard,
    // 'ui:options': {
    //   viewComponent: ResolutionDebtCard,
    // },

    debtType: {
      'ui:title': 'Post-9/11 GI Bill debt for tuition and fees',
      'ui:description': 'Amount owed: $9,525.00',
    },
    resolutionType: {
      'ui:title': ' ',
      'ui:description':
        'Which repayment or relief option would you like for this debt?',
      'ui:widget': 'radio',
    },
    eduWaiver: {
      'ui:options': {
        classNames: 'edu-waiver-checkbox',
        expandUnder: 'resolutionType',
        // expandUnderCondition: (selectedOption, formData) => {
        //   const index = window.location.href.slice(-1);
        //   const type = formData.selectedDebts[index]?.deductionCode;
        //   return selectedOption === 'Waiver' && type !== '30';
        // },
      },
      waiver: {
        'ui:title':
          'By checking this box, I’m agreeing that I understand how a debt  waiver may affect my VA education benefits. If VA grants me a waiver,  this will reduce any remaining education benefit entitlement I may have.',
        // 'ui:required': formData => isRequired(formData, 'Waiver'),
        'ui:options': {
          showFieldLabel: true,
        },
      },
      'view:components': {
        'view:waiverNote': {
          'ui:description': (
            <p>
              Note: If you have questions about this, call us at 800-827-0648
              (or 1-612-713-6415 from overseas). We’re here Monday through
              Friday, 7:30 a.m. to 7:00 p.m. ET.
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
        // 'ui:required': formData =>
        //   isRequired(formData, 'Extended monthly payments'),
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
        // 'ui:required': formData => isRequired(formData, 'Compromise'),
      },
    ),
  },
};

export const schema = {
  type: 'object',
  properties: {
    financialOverview: {
      type: 'object',
      properties: {},
    },
    // debtRepaymentOptions: {
    //   type: 'object',
    //   properties: {},
    // },
    // resolutionOptionsTitle: {
    //   type: 'object',
    //   properties: {},
    // },
    availableOptions: {
      type: 'object',
      properties: {},
    },
    resolution: {
      type: 'object',
      // required: ['resolutionType'],
      properties: {
        debtType: {
          type: 'object',
          properties: {},
        },
        resolutionType: {
          type: 'string',
          enum: ['Waiver', 'Extended monthly payments', 'Compromise'],
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
};
