import { expect } from 'chai';
import {
  reformatReturnPaymentDates,
  reformatPaymentDates,
} from 'applications/disability-benefits/view-payments/components/view-payments-lists/helpers';

describe('helper functions', () => {
  it('should handle invalid date fields', () => {
    const payments = [
      {
        payCheckAmount: '$177.60',
        payCheckDt: 'pending',
        payCheckId: '003',
        payCheckReturnFiche: 'C',
        payCheckType: 'Compensation & Pension - Retroactive',
      },
    ];
    const paymentsReturned = [
      {
        returnedCheckAmount: '$50.00',
        returnedCheckCancelDt: null,
        returnedCheckIssueDt: 'pending',
        returnedCheckNum: '12365494',
        returnedCheckRo: '17',
        returnedCheckReason: '6',
        returnedCheckReturnFiche: 'B',
        returnedCheckType: 'Post-9/11 Educational Assistance',
      },
    ];

    const reformattedPayments = reformatPaymentDates(payments);
    const reformattedReturnPayments = reformatReturnPaymentDates(
      paymentsReturned,
    );
    expect(reformattedPayments[0].payCheckDt).to.be.an('object');
    expect(reformattedReturnPayments[0].returnedCheckIssueDt).to.be.an(
      'object',
    );
  });
});
