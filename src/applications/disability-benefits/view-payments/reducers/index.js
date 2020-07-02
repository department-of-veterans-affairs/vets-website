import set from 'platform/utilities/data/set';

const initialState = {
  isLoading: true,
  hasPaymentsReceived: null,
  hasPaymentsReturned: null,
};

const mockData = {
  received: [
    {
      id: 1,
      date: 'June 4, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 2,
      date: 'June 3, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 3,
      date: 'June 4, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 4,
      date: 'June 3, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 5,
      date: 'June 4, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 5,
      date: 'June 3, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 6,
      date: 'June 4, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 7,
      date: 'June 3, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 8,
      date: 'June 4, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 9,
      date: 'June 3, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 10,
      date: 'June 4, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 11,
      date: 'June 3, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
  ],
  returned: [
    {
      id: 1,
      date: 'June 4, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
    {
      id: 2,
      date: 'June 3, 2020',
      amount: '$4,321',
      type: 'Componsation & Pension Recurring',
      method: 'Direct Deposit',
      bank: 'USAA FEDERAL SAVINGS BANK',
      account: '1234567890999',
      rowClass: 'class',
    },
  ],
};

const allPayments = (state = initialState, action) => {
  switch (action.type) {
    case 'PAYMENTS_RECEIVED_SUCCEEDED':
      return {
        ...state,
        isLoading: false,
        hasPaymentsReceived: mockData.received,
        hasPaymentsReturned: mockData.returned,
      };
    case 'PAYMENTS_RECEIVED_FAILED':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default { allPayments };
