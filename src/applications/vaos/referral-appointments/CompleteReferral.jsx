import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import ReferralLayout from './components/ReferralLayout';
import { setFormCurrentPage, startNewAppointmentFlow } from './redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../new-appointment/newAppointmentFlow';
import {
  getAppointmentCreateStatus,
  getReferralAppointmentInfo,
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

export default function CompleteReferral() {
  const dispatch = useDispatch();
  const appointmentCreateStatus = useSelector(getAppointmentCreateStatus);
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);
  const {
    appointmentInfoError,
    appointmentInfoTimeout,
    appointmentInfoLoading,
    referralAppointmentInfo,
  } = useSelector(getReferralAppointmentInfo);

  useEffect(
    () => {
      dispatch(setFormCurrentPage('complete'));
    },
    [dispatch],
  );

  const referralLoaded = !!referralAppointmentInfo?.appointment?.id;

  if (
    appointmentCreateStatus === FETCH_STATUS.succeeded &&
    (appointmentInfoError || appointmentInfoTimeout)
  ) {
    return (
      <ReferralLayout
        hasEyebrow
        heading={
          appointmentInfoTimeout
            ? "We're having trouble scheduling this appointment"
            : "We can't schedule this appointment online"
        }
      >
        <va-alert
          status={appointmentInfoTimeout ? 'warning' : 'error'}
          data-testid={appointmentInfoTimeout ? 'warning-alert' : 'error-alert'}
        >
          <p className="vads-u-margin-y--0">
            {appointmentInfoTimeout
              ? "Try refreshing this page. If it still doesn't work, call us at [Phone number]. We’re here [day] through [day], [time] to [time]."
              : 'We’re sorry. Call us at [Phone number]. We’re here [day] through [day], [time] to [time].'}
          </p>
        </va-alert>
      </ReferralLayout>
    );
  }

  const { appointment, provider } = referralAppointmentInfo;

  const appointmentDate = format(
    new Date(appointment.start),
    'EEEE, MMMM do, yyyy',
  );
  const appointmentTime = format(new Date(appointment.start), 'h:mm aaaa');

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
              {appointment.referral.typeOfCare} with{' '}
              {provider.individualProviders[0].name}
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
              {appointment.referral.modality} at {provider.location.name}
            </p>
            <p
              className="vads-u-margin-left--4 vads-u-margin-top--0p5"
              data-testid="appointment-clinic"
            >
              Clinic: {provider.providerOrganization.name}
            </p>
            <p>
              <va-link
                href={`/appointments/${appointment.id}`}
                data-testid="cc-details-link"
                text="Details"
              />
            </p>
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
}
