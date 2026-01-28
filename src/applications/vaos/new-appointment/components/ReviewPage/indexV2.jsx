import LoadingButton from '@department-of-veterans-affairs/platform-site-wide/LoadingButton';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import InfoAlert from '../../../components/InfoAlert';
import { FLOW_TYPES } from '../../../utils/constants';
import { aOrAn } from '../../../utils/formatters';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getPageTitle } from '../../newAppointmentFlow';
// import { submitAppointmentOrRequest } from '../../redux/actions';
import { selectReviewPage } from '../../redux/selectors';
import ReviewRequestInfo from './ReviewRequestInfo';
import ReviewDirectScheduleInfo from './ReviewRequestInfo/ReviewDirectScheduleInfo/ReviewDirectScheduleInfo';
import FacilityPhone from '../../../components/FacilityPhone';
import { useCreateAppointmentMutation } from '../../../services/appointment/apiSlice';

const pageKey = 'review';

export default function ReviewPage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  //   const dispatch = useDispatch();
  const {
    clinic,
    data,
    facility,
    flowType,
    parentFacility,
    // submitStatus,
    submitStatusVaos400,
    submitStatusVaos409,
    systemId,
    vaCityState,
  } = useSelector(selectReviewPage, shallowEqual);
  const history = useHistory();
  const [
    createAppointment,
    { data: appointment, isError, isLoading, isSuccess },
  ] = useCreateAppointmentMutation();

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
    },
    [pageTitle],
  );

  useEffect(
    () => {
      if (isError) {
        scrollAndFocus('.info-alert');
      }

      if (isSuccess) {
        history.push(`/${appointment?.id}?confirmMsg=true`);
      }
    },
    [appointment, history, isError, isSuccess],
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
  const phone = facilityDetails?.telecom?.find(tele => tele.system === 'phone')
    ?.value;

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
          disabled={isSuccess || isError}
          isLoading={isLoading}
          loadingText="Submission in progress"
          onClick={() => {
            createAppointment({
              kind: 'clinic',
              status: 'booked',
              clinic: 'clinicId',
              slot: {
                id: 'col1|col2|2026-01-28T14:00:00.000Z|col4|col5|col6',
              },
              extension: {
                desiredDate: `${data.preferredDate}T00:00:00+00:00`,
              },
              locationId: data.vaFacility,
              reasonCode: '000',
              //   getReasonCode({
              //     data,
              //     isCC: false,
              //     isDS: true,
              //     updateLimits,
              //   }),
            });
            // dispatch(submitAppointmentOrRequest(history));
          }}
          className={classNames('usa-button', 'usa-button-primary', {
            'vads-u-margin-top--5': FLOW_TYPES.REQUEST === flowType,
          })}
        >
          {isDirectSchedule ? 'Confirm appointment' : 'Submit request'}
        </LoadingButton>
      </div>
      {isError && (
        <div className="info-alert" role="alert">
          <InfoAlert status="error" headline={alertHeadline}>
            <>
              {submitStatusVaos409 && (
                <p>
                  You already have {aOrAn(submissionType)} {submissionType}{' '}
                  scheduled for this day and time. Choose a different day or
                  time. Or call your facility to help with your {submissionType}
                  .
                </p>
              )}
              {submitStatusVaos400 &&
                !submitStatusVaos409 && (
                  <p>
                    We’re sorry. Something went wrong when you tried to submit
                    your {submissionType}. Try again later. Or call your
                    facility to help with your {submissionType}.
                  </p>
                )}
              {!submitStatusVaos400 && (
                <>
                  <p>
                    We’re sorry. There’s a problem with appointments. Refresh
                    this page or try again later.
                  </p>
                  <p>If you need to schedule now, call your facility.</p>
                </>
              )}
              {!!facilityDetails && <strong>{facilityDetails.name}</strong>}
              {!!phone && (
                <p className="vads-u-margin-y--0">
                  <strong>Main phone: </strong>
                  <FacilityPhone contact={phone} icon={false} />
                </p>
              )}
            </>
          </InfoAlert>
        </div>
      )}
    </div>
  );
}
