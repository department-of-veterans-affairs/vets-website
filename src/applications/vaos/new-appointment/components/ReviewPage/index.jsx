import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import { selectReviewPage } from '../../redux/selectors';
import { FLOW_TYPES, FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import ReviewDirectScheduleInfo from './ReviewDirectScheduleInfo';
import ReviewRequestInfo from './ReviewRequestInfo';
import { submitAppointmentOrRequest } from '../../redux/actions';
import FacilityAddress from '../../../components/FacilityAddress';
import InfoAlert from '../../../components/InfoAlert';
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';

const pageTitle = 'Review your appointment details';

export default function ReviewPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const dispatch = useDispatch();
  const {
    clinic,
    data,
    facility,
    flowType,
    parentFacility,
    submitStatus,
    submitStatusVaos400,
    submitStatusVaos409,
    systemId,
    vaCityState,
  } = useSelector(selectReviewPage, shallowEqual);
  const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  useEffect(
    () => {
      if (submitStatus === FETCH_STATUS.failed) {
        scrollAndFocus('.info-alert');
      }
    },
    [submitStatus],
  );

  if (!data?.typeOfCareId) {
    return <Redirect to="/new-appointment" />;
  }

  const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;
  const submissionType = isDirectSchedule ? 'appointment' : 'request';
  const facilityDetails = facility || parentFacility;

  return (
    <div>
      {isDirectSchedule && (
        <ReviewDirectScheduleInfo
          data={data}
          facility={facility}
          systemId={systemId}
          clinic={clinic}
          pageTitle={pageTitle}
        />
      )}
      {!isDirectSchedule && (
        <ReviewRequestInfo
          data={data}
          facility={facility}
          vaCityState={vaCityState}
          pageTitle={pageTitle}
        />
      )}
      <div className="vads-u-margin-y--2">
        <LoadingButton
          disabled={
            submitStatus === FETCH_STATUS.succeeded ||
            submitStatus === FETCH_STATUS.failed
          }
          isLoading={submitStatus === FETCH_STATUS.loading}
          loadingText="Submission in progress"
          onClick={() => dispatch(submitAppointmentOrRequest(history))}
          className="usa-button usa-button-primary"
        >
          {isDirectSchedule ? 'Confirm appointment' : 'Request appointment'}
        </LoadingButton>
      </div>
      {submitStatus === FETCH_STATUS.failed && (
        <div className="info-alert" role="alert">
          <InfoAlert
            status="error"
            headline="We couldn’t schedule this appointment"
          >
            <>
              {submitStatusVaos409 && (
                <p>
                  We’re sorry. You already have an overlapping booked{' '}
                  {submissionType}. Please schedule for a different day.
                </p>
              )}
              {submitStatusVaos400 &&
                !submitStatusVaos409 && (
                  <p>
                    We’re sorry. Something went wrong when we tried to submit
                    your {submissionType}. Call your VA medical center to
                    schedule this {submissionType}.
                  </p>
                )}
              {!submitStatusVaos400 && (
                <p>
                  We’re sorry. Something went wrong when we tried to submit your{' '}
                  {submissionType}. You can try again later, or call your VA
                  medical center to help with your {submissionType}.
                </p>
              )}
              <>
                {!!facilityDetails && (
                  <FacilityAddress
                    name={facilityDetails.name}
                    facility={facilityDetails}
                    showDirectionsLink
                  />
                )}
              </>
            </>
          </InfoAlert>
        </div>
      )}
    </div>
  );
}

ReviewPage.propTypes = {
  changeCrumb: PropTypes.func,
};
