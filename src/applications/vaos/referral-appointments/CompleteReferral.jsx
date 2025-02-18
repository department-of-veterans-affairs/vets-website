import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

import ReferralLayout from './components/ReferralLayout';
import { setFormCurrentPage } from './redux/actions';
import { routeToCCPage } from './flow';
import CCAppointmentCard from './components/CCAppointmentCard';
import {
  getAppointmentCreateStatus,
  getReferralAppointmentInfo,
} from './redux/selectors';
import { FETCH_STATUS } from '../utils/constants';

export default function CompleteReferral() {
  const history = useHistory();
  const dispatch = useDispatch();
  const appointmentCreateStatus = useSelector(getAppointmentCreateStatus);
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

  const { provider, slots } = referralAppointmentInfo;

  return (
    <ReferralLayout
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
        <CCAppointmentCard>
          <div
            data-testid="referral-content"
            className="vads-u-background-color--success-lighter  vads-u-padding-x--2 vads-u-padding-y--1 vads-u-margin-y--2p5"
          >
            <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
              We’ve scheduled and confirmed your appointment.
            </h3>
            <>
              <va-link
                href="#"
                data-testid="review-appointments-link"
                onClick={e => {
                  e.preventDefault();
                  routeToCCPage(history, 'appointments');
                }}
                text="Review your appointments"
              />
            </>
          </div>
          <h5 className="vads-u-margin-bottom--0p5">When</h5>
          <p
            data-testid="appointment-date-time"
            className="vads-u-margin-top--0 vads-u-margin-bottom--1"
          >
            {`${format(new Date(slots.slots[0].start), 'EEEE, MMMM dd, yyyy')}`}
            <br />
          </p>
          <h5 className="vads-u-margin-bottom--0p5">What</h5>
          <h5 className="vads-u-margin-bottom--0p5">Who</h5>
          <p data-testid="provider-name" className="vads-u-margin--0">
            {provider.providerOrganization.name}
          </p>
          <h5 className="vads-u-margin-bottom--0p5">Where to attend</h5>
          <p data-testid="provider-org-name" className="vads-u-margin--0">
            {provider.location.name}
          </p>
          <p data-testid="provider-address" className="vads-u-margin--0">
            {provider.location.address}
          </p>
          <h5 className="vads-u-margin-bottom--0p5">Need to make changes?</h5>
          <p data-testid="changes-copy" className="vads-u-margin--0">
            Contact this referring VA facility if you need to reschedule or
            cancel your appointment and notify the VA of any changes.
          </p>
          <p
            className="vads-u-margin-bottom--0 vads-u-margin-top--1p5"
            data-testid="provider-facility-org-name"
          >
            {`Faciliy: ${provider.location.name}`}
          </p>
        </CCAppointmentCard>
      )}
    </ReferralLayout>
  );
}
