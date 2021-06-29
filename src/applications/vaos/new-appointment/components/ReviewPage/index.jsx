import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { selectReviewPage } from '../../redux/selectors';
import { FLOW_TYPES, FETCH_STATUS } from '../../../utils/constants';
import { getRealFacilityId } from '../../../utils/appointment';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import ReviewDirectScheduleInfo from './ReviewDirectScheduleInfo';
import ReviewRequestInfo from './ReviewRequestInfo';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import { submitAppointmentOrRequest } from '../../redux/actions';
import FacilityAddress from '../../../components/FacilityAddress';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';

const pageTitle = 'Review your appointment details';

export default function ReviewPage() {
  const dispatch = useDispatch();
  const {
    clinic,
    data,
    facility,
    facilityDetails,
    flowType,
    submitStatus,
    submitStatusVaos400,
    systemId,
    useProviderSelection,
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
          useProviderSelection={useProviderSelection}
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
              {submitStatusVaos400 ? (
                <p>
                  We’re sorry. Something went wrong when we tried to submit your{' '}
                  {submissionType}. You’ll need to call your local VA medical
                  center to schedule this appointment.
                </p>
              ) : (
                <p>
                  We’re sorry. Something went wrong when we tried to submit your{' '}
                  {submissionType} and you’ll need to start over. We suggest you
                  wait a day to try again or you can call your medical center to
                  help with your {submissionType}.
                </p>
              )}
              <>
                {!facilityDetails && (
                  <NewTabAnchor
                    href={`/find-locations/facility/vha_${getRealFacilityId(
                      data.vaFacility || data.communityCareSystemId,
                    )}`}
                  >
                    {submitStatusVaos400
                      ? 'Find facility contact information'
                      : 'Contact your local VA medical center'}
                  </NewTabAnchor>
                )}
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
