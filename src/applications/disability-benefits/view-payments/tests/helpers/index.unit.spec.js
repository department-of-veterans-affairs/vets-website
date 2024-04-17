import { expect } from 'chai';
import {
  formatDate,
  isValidDate,
  reformatReturnPaymentDates,
  reformatPaymentDates,
} from '../../components/view-payments-lists/helpers';

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

  describe('formatDate', () => {
    context('when given a valid date in the correct format', () => {
      it('returns a date in the correct format', () => {
        const inputs = ['2019-04-12T00:00:00.000-03:00', '2019-04-12'];

        for (const input of inputs) {
          const output = formatDate(input);
          expect(output).to.equal('April 12, 2019');
        }
      });
    });

    context('when given a valid date in an incorrect format', () => {
      it('returns ’Invalid date’', () => {
        const input = '04/12/2019';

        const output = formatDate(input);
        expect(output).to.equal('Invalid date');
      });
    });

    context('when given an invalid date', () => {
      it('returns ’Invalid date’', () => {
        const input = '1234567';

        const output = formatDate(input);
        expect(output).to.equal('Invalid date');
      });
    });
  });

  describe('isValidDate', () => {
    context('when given a valid date', () => {
      it('returns ’true’', () => {
        const inputs = ['2019-04-12T00:00:00.000-03:00', '2019-04-12'];

        for (const input of inputs) {
          const output = isValidDate(input);
          expect(output).to.be.true;
        }
      });
    });

    context('when given a valid date in an incorrect format', () => {
      it('returns ’false’', () => {
        const input = '04/12/2019';

        const output = isValidDate(input);
        expect(output).to.be.false;
      });
    });

    context('when given an invalid date', () => {
      it('returns ’false’', () => {
        const input = '1234567';

        const output = isValidDate(input);
        expect(output).to.be.false;
      });
    });
  });
});
