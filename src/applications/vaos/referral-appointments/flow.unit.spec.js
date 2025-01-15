import { expect } from 'chai';
import { getReferralUrlLabel } from './flow';

describe('Referral Appointments Flow', () => {
  describe('getReferralUrlLabel', () => {
    it('should return the correct label', () => {
      const location = { pathname: '/schedule-referral' };
      const categoryOfCare = 'Primary Care';
      const breadcrumb = getReferralUrlLabel(location, categoryOfCare);
      expect(breadcrumb).to.equal('Referral for Primary Care');
    });

    describe('when the location is a subpage of /schedule-referral/*', () => {
      it('should return "Back to appointments" for "/schedule-referral/complete"', () => {
        const location = { pathname: '/schedule-referral/complete' };
        const breadcrumb = getReferralUrlLabel(location);
        expect(breadcrumb).to.equal('Back to appointments');
      });
      it('should return "Back" for all pages that match /schedule-referral/*', () => {
        const location = { pathname: '/schedule-referral/date-time' };
        const breadcrumb = getReferralUrlLabel(location);
        expect(breadcrumb).to.equal('Back');
      });
    });

    it('should return null if the current location is not in the flow', () => {
      const location = { pathname: '/non-existent-url' };
      const breadcrumb = getReferralUrlLabel(location);
      expect(breadcrumb).to.be.null;
    });
  });
});
