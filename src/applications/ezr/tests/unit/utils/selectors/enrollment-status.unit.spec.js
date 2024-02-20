import { expect } from 'chai';
import { selectEnrollmentStatus } from '../../../../utils/selectors/entrollment-status';

describe('ezr enrollment status selectors', () => {
  const getData = ({
    profileLoading = false,
    esLoading = false,
    hasServerError = false,
    parsedStatus = null,
    canSubmitFinancialInfo = false,
  }) => ({
    state: {
      enrollmentStatus: {
        parsedStatus,
        hasServerError,
        loading: esLoading,
        canSubmitFinancialInfo,
      },
      user: {
        profile: {
          loading: profileLoading,
        },
      },
    },
  });

  context('when `selectEnrollmentStatus` executes', () => {
    context('when the user profile is loading', () => {
      it('should set the correct part of the state', () => {
        const { state } = getData({ profileLoading: true });
        const enrollmentStatus = selectEnrollmentStatus(state);
        expect(enrollmentStatus.isLoading).to.be.true;
        expect(enrollmentStatus.hasServerError).to.be.false;
        expect(enrollmentStatus.isValidEnrollmentStatus).to.be.false;
      });
    });

    context('when the enrollment status is loading', () => {
      it('should set the correct part of the state', () => {
        const { state } = getData({ esLoading: true });
        const enrollmentStatus = selectEnrollmentStatus(state);
        expect(enrollmentStatus.isLoading).to.be.true;
        expect(enrollmentStatus.hasServerError).to.be.false;
        expect(enrollmentStatus.isValidEnrollmentStatus).to.be.false;
      });
    });

    context('when the enrollment status fetch has failed', () => {
      it('should set the correct part of the state', () => {
        const { state } = getData({ hasServerError: true });
        const enrollmentStatus = selectEnrollmentStatus(state);
        expect(enrollmentStatus.isLoading).to.be.false;
        expect(enrollmentStatus.hasServerError).to.be.true;
        expect(enrollmentStatus.isValidEnrollmentStatus).to.be.false;
      });
    });

    context('when the enrollment status fetch has succeeded', () => {
      context(
        'when enrollment status is not `enrolled`, `pending_mt`, or `pending_other`',
        () => {
          it('should set the correct part of the state', () => {
            const { state } = getData({ parsedStatus: 'noneOfTheAbove' });
            const enrollmentStatus = selectEnrollmentStatus(state);
            expect(enrollmentStatus.isLoading).to.be.false;
            expect(enrollmentStatus.hasServerError).to.be.false;
            expect(enrollmentStatus.isValidEnrollmentStatus).to.be.false;
            expect(enrollmentStatus.canSubmitFinancialInfo).to.be.false;
          });
        },
      );

      context(
        'when enrollment status is `enrolled`, `pending_mt`, or `pending_other`',
        () => {
          it('should set the correct part of the state', () => {
            const { state } = getData({
              parsedStatus: 'pending_mt',
              canSubmitFinancialInfo: true,
            });
            const enrollmentStatus = selectEnrollmentStatus(state);
            expect(enrollmentStatus.isLoading).to.be.false;
            expect(enrollmentStatus.hasServerError).to.be.false;
            expect(enrollmentStatus.isValidEnrollmentStatus).to.be.true;
            expect(enrollmentStatus.canSubmitFinancialInfo).to.be.true;
          });
        },
      );
    });
  });
});
