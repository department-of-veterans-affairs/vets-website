import { subDays } from 'date-fns';

export const paymentsSuccess = (
  hasRecentPayment = false,
  lastPaymentMethod = ' Direct Deposit',
) => {
  return {
    data: {
      id: '',
      type: 'bgs_va_payment_history_response',
      attributes: {
        payments: [
          {
            payCheckAmount: '$1561.92',
            payCheckDt: hasRecentPayment
              ? subDays(Date.now(), 3)
              : subDays(Date.now(), 62),
            payCheckId: '001',
            payCheckReturnFiche: 'C',
            payCheckType: 'Compensation & Pension - Recurring',
            paymentMethod: lastPaymentMethod,
            bankName: 'NAVY FEDERAL CREDIT UNION',
            accountNumber: '****1234',
          },
          {
            payCheckAmount: '$3,261.10',
            payCheckDt: '04/01/2019',
            payCheckId: '001',
            payCheckReturnFiche: 'C',
            payCheckType: 'Compensation & Pension - Recurring',
            paymentMethod: ' Direct Deposit',
            bankName: 'NAVY FEDERAL CREDIT UNION',
            accountNumber: '****1234',
          },
          {
            payCheckAmount: '$3,261.10',
            payCheckDt: '04/01/2019',
            payCheckId: '001',
            payCheckReturnFiche: 'C',
            payCheckType: 'Compensation & Pension - Recurring',
            paymentMethod: ' Direct Deposit',
            bankName: 'NAVY FEDERAL CREDIT UNION',
            accountNumber: '****1234',
          },
          {
            payCheckAmount: '$3,261.10',
            payCheckDt: '04/01/2019',
            payCheckId: '001',
            payCheckReturnFiche: 'C',
            payCheckType: 'Compensation & Pension - Recurring',
            paymentMethod: ' Direct Deposit',
            bankName: 'NAVY FEDERAL CREDIT UNION',
            accountNumber: '****1234',
          },
          {
            payCheckAmount: '$3,261.10',
            payCheckDt: '04/01/2019',
            payCheckId: '001',
            payCheckReturnFiche: 'C',
            payCheckType: 'Compensation & Pension - Recurring',
            paymentMethod: ' Direct Deposit',
            bankName: 'NAVY FEDERAL CREDIT UNION',
            accountNumber: '****1234',
          },
          {
            payCheckAmount: '$3,261.10',
            payCheckDt: '04/01/2019',
            payCheckId: '001',
            payCheckReturnFiche: 'C',
            payCheckType: 'Compensation & Pension - Recurring',
            paymentMethod: ' Direct Deposit',
            bankName: 'NAVY FEDERAL CREDIT UNION',
            accountNumber: '****1234',
          },
          {
            payCheckAmount: '$3,261.10',
            payCheckDt: '04/01/2019',
            payCheckId: '001',
            payCheckReturnFiche: 'C',
            payCheckType: 'Compensation & Pension - Recurring',
            paymentMethod: ' Direct Deposit',
            bankName: 'NAVY FEDERAL CREDIT UNION',
            accountNumber: '****1234',
          },
          {
            payCheckAmount: '$3,261.10',
            payCheckDt: '04/01/2019',
            payCheckId: '001',
            payCheckReturnFiche: 'C',
            payCheckType: 'Compensation & Pension - Recurring',
            paymentMethod: ' Direct Deposit',
            bankName: 'NAVY FEDERAL CREDIT UNION',
            accountNumber: '****1234',
          },
          {
            payCheckAmount: '$3,261.10',
            payCheckDt: '04/01/2019',
            payCheckId: '001',
            payCheckReturnFiche: 'C',
            payCheckType: 'Compensation & Pension - Recurring',
            paymentMethod: ' Direct Deposit',
            bankName: 'NAVY FEDERAL CREDIT UNION',
            accountNumber: '****1234',
          },
        ],
        returnPayments: [
          {
            returnedCheckIssueDt: '2012-12-15T00:00:00.000-06:00',
            returnedCheckCancelDt: '2013-01-01T00:00:00.000-06:00',
            returnedCheckAmount: '$250.00',
            returnedCheckNumber: '12365506',
            returnedCheckType: 'CH31 VR&E',
            returnReason: 'Other Reason',
          },
          {
            returnedCheckIssueDt: '2012-12-15T00:00:00.000-06:00',
            returnedCheckCancelDt: '2013-01-01T00:00:00.000-06:00',
            returnedCheckAmount: '$250.00',
            returnedCheckNumber: '12365506',
            returnedCheckType: 'CH31 VR&E',
            returnReason: 'Other Reason',
          },
          {
            returnedCheckIssueDt: '2012-12-15T00:00:00.000-06:00',
            returnedCheckCancelDt: '2013-01-01T00:00:00.000-06:00',
            returnedCheckAmount: '$250.00',
            returnedCheckNumber: '12365506',
            returnedCheckType: 'CH31 VR&E',
            returnReason: 'Other Reason',
          },
        ],
      },
    },
  };
};

export const paymentsSuccessEmpty = () => {
  return {
    data: {
      id: '',
      type: 'bgs_va_payment_history_response',
      attributes: {
        payments: [],
      },
    },
  };
};

export const paymentsError = () => {
  return {
    errors: [
      {
        title: 'Server Error',
        code: '500',
        status: '500',
      },
    ],
  };
};
