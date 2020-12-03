import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your installment contracts and other repayments',
  'ui:description':
    'Enter all debts you’re required to pay in regular monthly installments separately below. These debts include payments for car, television, washing machine, dealers, banks, finance companies, doctor bills, hospital bills, and repayment of borrowed money.',
  householdRepayments: {
    repaymentRecords: {
      'ui:options': {
        viewField: CardDetailsView,
        doNotScroll: true,
        showSave: true,
      },
      'ui:field': ItemLoop,
      items: {
        debtPurpose: {
          'ui:title': 'Purpose of debt',
          'ui:required': () => true,
        },
        creditorName: {
          'ui:title': 'Name of creditor',
        },
        unpaidBalance: {
          'ui:title': 'Unpaid balance',
        },
        monthlyPaymentAmount: {
          'ui:title': 'Monthly payment amount',
          'ui:required': () => true,
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    householdRepayments: {
      type: 'object',
      properties: {
        repaymentRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              debtPurpose: {
                type: 'string',
              },
              creditorName: {
                type: 'string',
              },
              unpaidBalance: {
                type: 'number',
              },
              monthlyPaymentAmount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
