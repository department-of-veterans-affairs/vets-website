import { expect } from 'chai';
import { selectEnrollmentStatus } from '../../../../utils/selectors/enrollment-status';
import {
  HCA_ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_INIT_STATE,
} from '../../../../utils/constants';

describe('hca EnrollmentStatus selectors', () => {
  const getData = ({ status = null, error = false, loading = false }) => ({
    state: {
      hcaEnrollmentStatus: {
        ...ENROLLMENT_STATUS_INIT_STATE,
        isLoadingApplicationStatus: loading,
        hasServerError: error,
        enrollmentStatus: status,
        noESRRecordFound:
          status && status === HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
      },
    },
  });

  it('should set the correct values when the application status is loading', () => {
    const { state } = getData({ loading: true });
    const { isLoadingApplicationStatus } = selectEnrollmentStatus(state);
    expect(isLoadingApplicationStatus).to.be.true;
  });

  it('should set the correct values when a server error has occurred', () => {
    const { state } = getData({ error: true });
    const { hasServerError } = selectEnrollmentStatus(state);
    expect(hasServerError).to.be.true;
  });

  it('should set the correct values when a status of `none_of_the_above` is returned', () => {
    const { state } = getData({
      status: HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
    });
    const {
      enrollmentStatus,
      noESRRecordFound,
      isEnrolledInESR,
    } = selectEnrollmentStatus(state);
    expect(enrollmentStatus).to.eq(HCA_ENROLLMENT_STATUSES.noneOfTheAbove);
    expect(noESRRecordFound).to.be.true;
    expect(isEnrolledInESR).to.be.false;
  });

  it('should set the correct values when a status of `enrolled` is returned', () => {
    const { state } = getData({
      status: HCA_ENROLLMENT_STATUSES.enrolled,
    });
    const {
      enrollmentStatus,
      noESRRecordFound,
      isEnrolledInESR,
    } = selectEnrollmentStatus(state);
    expect(enrollmentStatus).to.eq(HCA_ENROLLMENT_STATUSES.enrolled);
    expect(noESRRecordFound).to.be.false;
    expect(isEnrolledInESR).to.be.true;
  });
});
