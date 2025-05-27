import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { titleCase } from '../utils/formatters';
import ReferralLayout from './components/ReferralLayout';
import { routeToNextReferralPage } from './flow';
import {
  pollFetchAppointmentInfo,
  setFormCurrentPage,
  startNewAppointmentFlow,
} from './redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../new-appointment/newAppointmentFlow';
import {
  getAppointmentCreateStatus,
  getReferralAppointmentInfo,
  selectCurrentPage,
} from './redux/selectors';
import { FETCH_STATUS, GA_PREFIX } from '../utils/constants';

function handleScheduleClick(dispatch) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
  };
}

export const CompleteReferral = props => {
  const { attributes: currentReferral } = props.currentReferral;
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const appointmentCreateStatus = useSelector(getAppointmentCreateStatus);
  const currentPage = useSelector(selectCurrentPage);
  const [, appointmentId] = pathname.split('/schedule-referral/complete/');
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);
  const {
    appointmentInfoError,
    appointmentInfoTimeout,
    appointmentInfoLoading,
    referralAppointmentInfo,
  } = useSelector(getReferralAppointmentInfo);

  function goToDetailsView(e) {
    e.preventDefault();
    recordEvent({
      event: `${GA_PREFIX}-view-eps-appointment-details-button-clicked`,
    });
    routeToNextReferralPage(history, currentPage, null, appointmentId);
  }

  useEffect(
    () => {
      dispatch(setFormCurrentPage('complete'));
    },
    [dispatch],
  );
  useEffect(
    () => {
      if (
        !appointmentInfoError &&
        !appointmentInfoTimeout &&
        !appointmentInfoLoading &&
        referralAppointmentInfo?.attributes?.status !== 'booked'
      ) {
        dispatch(
          pollFetchAppointmentInfo(appointmentId, {
            timeOut: 30000,
            retryCount: 3,
            retryDelay: 1000,
          }),
        );
      }
    },
    [
      dispatch,
      appointmentId,
      referralAppointmentInfo?.attributes?.status,
      appointmentInfoError,
      appointmentInfoTimeout,
      appointmentCreateStatus,
      appointmentInfoLoading,
    ],
  );
  if (appointmentInfoError || appointmentInfoTimeout) {
    return (
      <ReferralLayout
        hasEyebrow
        heading={
          appointmentInfoTimeout
            ? 'We’re having trouble scheduling this appointment'
            : 'We can’t schedule this appointment online'
        }
      >
        <va-alert
          status={appointmentInfoTimeout ? 'warning' : 'error'}
          data-testid={appointmentInfoTimeout ? 'warning-alert' : 'error-alert'}
        >
          <p className="vads-u-margin-y--0">
            {appointmentInfoTimeout
              ? `Try refreshing this page. If it still doesn’t work, please call us at ${
                  currentReferral.referringFacility.phone
                } during normal business hours to schedule.`
              : `We’re sorry. Please call us at ${
                  currentReferral.referringFacility.phone
                } during normal business hours to schedule.`}
          </p>
        </va-alert>
      </ReferralLayout>
    );
  }

  if (appointmentInfoLoading || !referralAppointmentInfo.attributes) {
    return (
      <ReferralLayout loadingMessage="Confirming your appointment. This may take up to 30 seconds. Please don’t refresh the page." />
    );
  }

  const referralLoaded = !!referralAppointmentInfo?.attributes?.id;

  const { attributes } = referralAppointmentInfo;

  const appointmentDate = format(
    new Date(attributes.start),
    'EEEE, MMMM do, yyyy',
  );
  const appointmentTime = format(new Date(attributes.start), 'h:mm aaaa');

  return (
    <ReferralLayout
      hasEyebrow
      heading="Your appointment is scheduled"
      apiFailure={
        appointmentInfoError &&
        appointmentCreateStatus !== FETCH_STATUS.succeeded
      }
      loadingMessage={
        appointmentInfoLoading || !referralLoaded
          ? 'Loading your appointment details'
          : null
      }
    >
      {!!referralLoaded && (
        <>
          <p>We’ve confirmed your appointment.</p>
          <div
            className="vads-u-margin-top--6 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter"
            data-testid="appointment-block"
          >
            <p
              className="vads-u-margin-bottom--0 vads-u-font-family--serif"
              data-testid="appointment-date"
            >
              {appointmentDate}
            </p>
            <h2
              className="vads-u-margin-top--0 vads-u-margin-bottom-1"
              data-testid="appointment-time"
            >
              {appointmentTime}
            </h2>
            <strong data-testid="appointment-type">
              {titleCase(attributes.typeOfCare)} with{' '}
              {`${attributes.provider.name || 'Provider name not available'}`}
            </strong>
            <p
              className="vaos-appts__display--table-cell vads-u-display--flex vads-u-align-items--center vads-u-margin-bottom--0"
              data-testid="appointment-modality"
            >
              <span className="vads-u-margin-right--1">
                <va-icon
                  icon="location_city"
                  aria-hidden="true"
                  data-testid="appointment-icon"
                  size={3}
                />
              </span>
              {attributes.modality} at {attributes.provider.practice}
            </p>
            {attributes.provider.clinic && (
              <p
                className="vads-u-margin-left--4 vads-u-margin-top--0p5"
                data-testid="appointment-clinic"
              >
                Clinic: {attributes.provider.clinic}
              </p>
            )}
            <p>
              <va-link
                href={`${root.url}/${attributes.id}?eps=true`}
                data-testid="cc-details-link"
                text="Details"
                onClick={e => goToDetailsView(e)}
              />
            </p>
          </div>
          <div className="vads-u-margin-top--2">
            <va-alert
              status="info"
              data-testid="survey-info-block"
              className="vads-u-padding--2"
            >
              <h3 className="vads-u-font-size--h4 vads-u-margin-top--0">
                Please consider taking our pilot feedback surveys
              </h3>
              <p className="vads-u-margin-top--0">
                First, you will follow the link below to the{' '}
                <strong>sign-up survey</strong> with our recruitment partner.
              </p>
              <p>
                Next, you will be contacted by our recruitment partner and
                provided the <strong>feedback</strong> survey.
              </p>
              <p className="vads-u-margin-y--1">
                Our recruiting partner will provide compensation.
              </p>
              <p className="vads-u-margin-bottom--0">
                <va-link
                  href="https://forms.gle/7Lh5H2fab7Qv3DbA9"
                  text="Start the sign-up survey"
                  data-testid="survey-link"
                />
              </p>
            </va-alert>
          </div>
          <div className="vads-u-margin-top--6">
            <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
              Manage your appointments
            </h2>
            <hr
              aria-hidden="true"
              className="vads-u-margin-y--1p5 vads-u-border-color--primary"
            />
            <p>
              <va-link
                text="Review your appointments"
                data-testid="view-appointments-link"
                href={`${root.url}`}
              />
            </p>
            <p>
              <va-link
                text="Schedule a new appointment"
                data-testid="schedule-appointment-link"
                href={`${root.url}${typeOfCare.url}`}
                onClick={handleScheduleClick(dispatch)}
              />
            </p>
            <p>
              <va-link
                text="Review Referrals and Requests"
                data-testid="return-to-referrals-link"
                href={`${root.url}/referrals-requests`}
              />
            </p>
          </div>
        </>
      )}
    </ReferralLayout>
  );
};

CompleteReferral.propTypes = {
  currentReferral: PropTypes.object.isRequired,
};

export default CompleteReferral;
