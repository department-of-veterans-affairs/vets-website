import { expect } from 'chai';
import { PAYMENT_PAUSED_DAY_OF_MONTH } from '../../constants';
import { monthlyPaymentsPaused } from '../../helpers';
// import { prefillTransformerV1, prefillTransformerV2 } from '../../helpers';
// import { claimantInfo } from '../fixtures/data/prefill-transformer-test-data';

// let mockClaimantInfo;

describe('helpers', () => {
  //   beforeEach(() => {
  //     mockClaimantInfo = JSON.parse(JSON.stringify(claimantInfo));
  //   });

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

    it('payments may be paused when two months have’t been verified', () => {
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
        now.getDate() > PAYMENT_PAUSED_DAY_OF_MONTH,
      );
    });

    it('payments will be paused when three months have’t been verified', () => {
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
