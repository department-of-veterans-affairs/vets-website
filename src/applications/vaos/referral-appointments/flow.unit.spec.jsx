import { expect } from 'chai';
import { getReferralUrlLabel } from './flow';

describe('Referral Appointments Flow', () => {
  describe('getReferralUrlLabel', () => {
    const tests = [
      {
        currentPage: 'error',
        categoryOfCare: 'Primary Care',
        expected: 'Back to appointments',
      },
      {
        currentPage: 'appointments',
        categoryOfCare: 'Primary Care',
        expected: 'Appointments',
      },
      {
        currentPage: 'referralsAndRequests',
        categoryOfCare: 'Primary Care',
        expected: 'Referrals and requests',
      },
      {
        currentPage: 'scheduleReferral',
        categoryOfCare: 'Primary Care',
        expected: 'Appointment Referral',
      },
      {
        currentPage: 'scheduleAppointment',
        categoryOfCare: 'Primary Care',
        expected: 'Back',
      },
      {
        currentPage: 'reviewAndConfirm',
        categoryOfCare: 'Primary Care',
        expected: 'Back',
      },
      {
        currentPage: 'complete',
        categoryOfCare: 'Primary Care',
        expected: 'Back to appointments',
      },
      {
        currentPage: 'nonExistingPage',
        categoryOfCare: 'Primary Care',
        expected: null,
      },
    ];
    it('should return the correct label for current page in the flow', () => {
      tests.forEach(test => {
        const breadcrumb = getReferralUrlLabel(
          test.currentPage,
          test.categoryOfCare,
        );
        expect(breadcrumb).to.equal(test.expected);
      });
    });

    it('should return null if the current location is not in the flow', () => {
      const breadcrumb = getReferralUrlLabel('nonExistingPage');
      expect(breadcrumb).to.be.null;
    });
  });
});
