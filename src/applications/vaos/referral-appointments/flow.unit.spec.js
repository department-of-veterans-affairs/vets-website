import { expect } from 'chai';
import { getReferralBreadcumb } from './flow';

describe('Referral Appointments Flow', () => {
  describe('getReferralBreadcumb', () => {
    it('should return the correct breadcrumb information', () => {
      const location = { href: '/schedule-referral' };
      const currentPage = 'scheduleReferral';
      const referralId = '123';
      const categoryOfCare = 'Primary Care';
      const breadcrumb = getReferralBreadcumb(
        location,
        currentPage,
        referralId,
        categoryOfCare,
      );
      expect(breadcrumb).to.deep.equal({
        href: '/schedule-referral',
        label: 'Referral for Primary Care',
        useBackBreadcrumb: false,
      });
    });

    it('should return null if the current page is not found in the flow', () => {
      const location = { href: '/non-existent-url' };
      const currentPage = 'nonExistentPage';
      const referralId = '123';
      const breadcrumb = getReferralBreadcumb(
        location,
        currentPage,
        referralId,
      );
      expect(breadcrumb).to.be.null;
    });
  });
});
