import { expect } from 'chai';
import { selectEnrollmentStatus } from '../../../../utils/selectors';
import {
  HCA_ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_INIT_STATE,
} from '../../../../utils/constants';

describe('hca enrollment status selectors', () => {
  const getData = ({ status = null, error = false, isLoading = false }) => ({
    state: {
      hcaEnrollmentStatus: {
        ...ENROLLMENT_STATUS_INIT_STATE,
        loading: isLoading,
        hasServerError: error,
        statusCode: status,
      },
    },
  });

  it('should set the correct values when the application status is loading', () => {
    const { state } = getData({ isLoading: true });
    const { loading } = selectEnrollmentStatus(state);
    expect(loading).to.be.true;
  });

  it('should set the correct values when a server error has occurred', () => {
    const { state } = getData({ error: true });
    const { hasServerError } = selectEnrollmentStatus(state);
    expect(hasServerError).to.be.true;
  });

  it('should set the correct values when a status of `none_of_the_above` is returned', () => {
    const { noneOfTheAbove } = HCA_ENROLLMENT_STATUSES;
    const { state } = getData({ status: noneOfTheAbove });
    const {
      statusCode,
      vesRecordFound,
      isEnrolledInESR,
    } = selectEnrollmentStatus(state);
    expect(statusCode).to.eq(noneOfTheAbove);
    expect(vesRecordFound).to.be.false;
    expect(isEnrolledInESR).to.be.false;
  });

  it('should set the correct values when a status of `enrolled` is returned', () => {
    const { enrolled } = HCA_ENROLLMENT_STATUSES;
    const { state } = getData({ status: enrolled });
    const {
      statusCode,
      vesRecordFound,
      isEnrolledInESR,
    } = selectEnrollmentStatus(state);
    expect(statusCode).to.eq(enrolled);
    expect(vesRecordFound).to.be.true;
    expect(isEnrolledInESR).to.be.true;
  });
});
