import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import LoadingButton from '@department-of-veterans-affairs/platform-site-wide/LoadingButton';
import classNames from 'classnames';
import { selectReviewPage } from '../../redux/selectors';
import { FLOW_TYPES, FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import ReviewDirectScheduleInfo from './ReviewRequestInfo/ReviewDirectScheduleInfo/ReviewDirectScheduleInfo';
import ReviewRequestInfo from './ReviewRequestInfo';
import { submitAppointmentOrRequest } from '../../redux/actions';
import FacilityAddress from '../../../components/FacilityAddress';
import InfoAlert from '../../../components/InfoAlert';
import { getPageTitle } from '../../newAppointmentFlow';

const pageKey = 'review';

export default function ReviewPage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

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
  const alertHeadline = isDirectSchedule
    ? 'We can’t schedule your appointment right now'
    : 'We can’t submit your request right now';
  const facilityDetails = facility || parentFacility;

  return (
    <div>
      {isDirectSchedule && (
        <ReviewDirectScheduleInfo
          data={data}
          facility={facilityDetails}
          systemId={systemId}
          clinic={clinic}
          pageTitle={pageTitle}
        />
      )}
      {!isDirectSchedule && (
        <ReviewRequestInfo
          data={data}
          facility={facilityDetails}
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
          className={classNames('usa-button', 'usa-button-primary', {
            'vads-u-margin-top--5': FLOW_TYPES.REQUEST === flowType,
          })}
        >
          {isDirectSchedule ? 'Confirm appointment' : 'Submit request'}
        </LoadingButton>
      </div>
      {submitStatus === FETCH_STATUS.failed && (
        <div className="info-alert" role="alert">
          <InfoAlert status="error" headline={alertHeadline}>
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
                <>
                  <p>
                    We’re sorry. There’s a problem with our system. Refresh this
                    page to start over or try again later.
                  </p>
                  <p>If you need to schedule now, call your VA facility.</p>
                </>
              )}
              <>
                {!!facilityDetails && (
                  <FacilityAddress
                    name={facilityDetails.name}
                    facility={facilityDetails}
                    showDirectionsLink
                    level={3}
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
