import { expect } from 'chai';
import { selectEnrollmentStatus } from '../../../../utils/selectors/entrollment-status';

describe('ezr enrollment status selectors', () => {
  const defaultState = {
    enrollmentStatus: {
      parsedStatus: null,
      hasServerError: false,
      loading: false,
    },
    user: {
      profile: {
        loading: false,
      },
    },
  };

  describe('when `selectEnrollmentStatus` executes', () => {
    context('when the user profile is loading', () => {
      it('should set the correct part of the state', () => {
        const state = {
          enrollmentStatus: { ...defaultState.enrollmentStatus },
          user: { profile: { loading: true } },
        };
        const enrollmentStatus = selectEnrollmentStatus(state);
        expect(enrollmentStatus.isLoading).to.be.true;
        expect(enrollmentStatus.hasServerError).to.be.false;
        expect(enrollmentStatus.isEnrolledinESR).to.be.false;
      });
    });

    context('when the enrollment status is loading', () => {
      it('should set the correct part of the state', () => {
        const state = {
          enrollmentStatus: {
            ...defaultState.enrollmentStatus,
            loading: true,
          },
          user: { ...defaultState.user },
        };
        const enrollmentStatus = selectEnrollmentStatus(state);
        expect(enrollmentStatus.isLoading).to.be.true;
        expect(enrollmentStatus.hasServerError).to.be.false;
        expect(enrollmentStatus.isEnrolledinESR).to.be.false;
      });
    });

    context('when the enrollment status fetch has failed', () => {
      it('should set the correct part of the state', () => {
        const state = {
          enrollmentStatus: {
            ...defaultState.enrollmentStatus,
            hasServerError: true,
          },
          user: { ...defaultState.user },
        };
        const enrollmentStatus = selectEnrollmentStatus(state);
        expect(enrollmentStatus.isLoading).to.be.false;
        expect(enrollmentStatus.hasServerError).to.be.true;
        expect(enrollmentStatus.isEnrolledinESR).to.be.false;
      });
    });

    context('when the enrollment status fetch has succeeded', () => {
      context('when enrollment status is not `enrolled`', () => {
        it('should set the correct part of the state', () => {
          const state = {
            enrollmentStatus: {
              ...defaultState.enrollmentStatus,
              parsedStatus: 'noneOfTheAbove',
            },
            user: { ...defaultState.user },
          };
          const enrollmentStatus = selectEnrollmentStatus(state);
          expect(enrollmentStatus.isLoading).to.be.false;
          expect(enrollmentStatus.hasServerError).to.be.false;
          expect(enrollmentStatus.isEnrolledinESR).to.be.false;
        });
      });

      context('when enrollment status is `enrolled`', () => {
        it('should set the correct part of the state', () => {
          const state = {
            enrollmentStatus: {
              ...defaultState.enrollmentStatus,
              parsedStatus: 'enrolled',
            },
            user: { ...defaultState.user },
          };
          const enrollmentStatus = selectEnrollmentStatus(state);
          expect(enrollmentStatus.isLoading).to.be.false;
          expect(enrollmentStatus.hasServerError).to.be.false;
          expect(enrollmentStatus.isEnrolledinESR).to.be.true;
        });
      });
    });
  });
});
