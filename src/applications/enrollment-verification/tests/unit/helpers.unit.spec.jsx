import { expect } from 'chai';
import { PAYMENT_PAUSED_DAY_OF_MONTH } from '../../constants';
import {
  convertNumberToStringWithMinimumDigits,
  formatNumericalDate,
  formatReadableMonthYear,
  monthlyPaymentsPaused,
} from '../../helpers';
// import { prefillTransformerV1, prefillTransformerV2 } from '../../helpers';
// import { claimantInfo } from '../fixtures/data/prefill-transformer-test-data';

// let mockClaimantInfo;

describe('helpers', () => {
  //   beforeEach(() => {
  //     mockClaimantInfo = JSON.parse(JSON.stringify(claimantInfo));
  //   });
  describe('month formatters', () => {
    it('formatNumericalDate', () => {
      expect(formatNumericalDate('2019-04-10')).to.eql('4/10/2019');
      expect(formatNumericalDate('2020-02-29')).to.eql('2/29/2020');
      expect(formatNumericalDate('')).to.eql('');
    });

    it('formatReadableMonthYear', () => {
      expect(formatReadableMonthYear('2021-01-14')).to.eql('January 2021');
      expect(formatReadableMonthYear('2000-12-31')).to.eql('December 2000');
    });
  });

  describe('utility functions', () => {
    it('convertNumberToStringWithMinimumDigits', () => {
      // expect(convertNumberToStringWithMinimumDigits(5, 0)).to.eql('5');
      expect(convertNumberToStringWithMinimumDigits(5, 1)).to.eql('5');
      expect(convertNumberToStringWithMinimumDigits(5, 2)).to.eql('05');
      expect(convertNumberToStringWithMinimumDigits(5, 3)).to.eql('005');
      expect(convertNumberToStringWithMinimumDigits(2022, 2)).to.eql('2022');
      expect(convertNumberToStringWithMinimumDigits(2022, 5)).to.eql('02022');
      expect(convertNumberToStringWithMinimumDigits(3.14159, 1)).to.eql(
        '3.142',
      );
      expect(convertNumberToStringWithMinimumDigits(3.14159, 2)).to.eql(
        '03.142',
      );
      expect(convertNumberToStringWithMinimumDigits(3.14159, 3)).to.eql(
        '003.142',
      );
    });
  });

  describe('paused payments calculation', () => {
    it('payments are not paused when the last certified through date is in the future', () => {
      const earliestUncertifiedEndDate = new Date();
      earliestUncertifiedEndDate.setFullYear(
        earliestUncertifiedEndDate.getFullYear() + 1,
      );
      const paymentsPaused = monthlyPaymentsPaused(
        earliestUncertifiedEndDate.toISOString(),
      );
      expect(paymentsPaused).to.eql(false);
    });

    it('payments are not paused when one month hasn’t been verified', () => {
      const now = new Date();

      const lastDayOfLastMonth = new Date(
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
        ((now.getMonth() + 11) % 12) + 1,
        0,
      );

      const paymentsPaused = monthlyPaymentsPaused(
        lastDayOfLastMonth.toISOString(),
      );

      expect(paymentsPaused).to.eql(false);
    });

    it('payments may be paused when two months have not been verified', () => {
      const now = new Date();

      const lastDayOfTwoMonthsAgo = new Date(
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
        (now.getMonth() + 11) % 12,
        0,
      );

      const paymentsPaused = monthlyPaymentsPaused(
        lastDayOfTwoMonthsAgo.toISOString(),
      );

      // Paused if we're past the payment paused date (the 25th)
      expect(paymentsPaused).to.eql(
        now.getDate() >= PAYMENT_PAUSED_DAY_OF_MONTH,
      );
    });

    it.skip('payments will be paused when three months have’t been verified', () => {
      const now = new Date();

      const lastDayOfThreeMonthsAgo = new Date(
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
        (now.getMonth() + 10) % 12,
        0,
      );

      const paymentsPaused = monthlyPaymentsPaused(
        lastDayOfThreeMonthsAgo.toISOString(),
      );

      // Paused if we're past the payment paused date (the 25th)
      expect(paymentsPaused).to.eql(true);
    });
  });
});
