import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

import { fetchAppointmentInfo, setFormCurrentPage } from './redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import { getReferralAppointmentInfo } from './redux/selectors';

// eslint-disable-next-line import/no-restricted-paths
import PageLayout from '../appointment-list/components/PageLayout';
import FullWidthLayout from '../components/FullWidthLayout';
import Section from '../components/Section';
import {
  AppointmentTime,
  // eslint-disable-next-line import/no-restricted-paths
} from '../appointment-list/components/AppointmentDateTime';
import FacilityPhone from '../components/FacilityPhone';

export default function EpsAppointmentDetailsPage() {
  const { pathname } = useLocation();
  // get the id from the url my-health/appointments/1234
  const [, appointmentId] = pathname.split('/');
  const dispatch = useDispatch();

  const {
    appointmentInfoError,
    appointmentInfoTimeout,
    appointmentInfoLoading,
    referralAppointmentInfo,
  } = useSelector(getReferralAppointmentInfo);

  useEffect(
    () => {
      dispatch(setFormCurrentPage('details'));
    },
    [dispatch],
  );
  useEffect(
    () => {
      if (
        !appointmentInfoError &&
        !appointmentInfoTimeout &&
        !appointmentInfoLoading &&
        !referralAppointmentInfo?.attributes
      ) {
        dispatch(fetchAppointmentInfo(appointmentId));
      }
    },
    [
      dispatch,
      appointmentId,
      appointmentInfoError,
      appointmentInfoTimeout,
      appointmentInfoLoading,
      referralAppointmentInfo,
    ],
  );
  if (appointmentInfoError || appointmentInfoTimeout) {
    return (
      <PageLayout showNeedHelp>
        <br />
        <div aria-atomic="true" aria-live="assertive">
          <va-alert
            status="error"
            level={1}
            headline="We’re sorry, we can’t find your appointment"
            data-testid="error-alert"
          >
            Try searching this appointment on your appointment list or call your
            facility.
            <p className="vads-u-margin-y--0p5">
              <va-link
                data-testid="view-claim-link"
                href="/my-health/appointments"
                text="Go to appointments"
              />
            </p>
          </va-alert>
        </div>
      </PageLayout>
    );
  }

  if (appointmentInfoLoading || !referralAppointmentInfo?.attributes) {
    return (
      <FullWidthLayout>
        <va-loading-indicator set-focus message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  const { attributes: appointment } = referralAppointmentInfo;

  const appointmentDate = format(
    new Date(appointment.start),
    'EEEE, MMMM do, yyyy',
  );

  return (
    <PageLayout>
      <div
        className="vaos-appts__appointment-details--container vads-u-margin-top--4 vads-u-border--2px vads-u-border-color--gray-medium vads-u-padding-x--2p5 vads-u-padding-top--5 vads-u-padding-bottom--3"
        data-testid="appointment-card"
      >
        <div className="vaos-appts__appointment-details--icon">
          <va-icon
            icon="calendar_today"
            aria-hidden="true"
            data-testid="appointment-icon"
            size={3}
          />
        </div>
        <h1 className="vaos__dynamic-font-size--h2">
          Community Care Appointment
        </h1>
        <Section heading="When">
          {appointmentDate}
          <br />
          <AppointmentTime appointment={appointment} />
        </Section>
        <Section heading="What">
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            {appointment.typeOfCare}
          </p>
        </Section>
        <Section heading="Provider">
          <span>
            {`${appointment.provider.name ||
              'Provider information not available'}`}
          </span>
          <br />
          {appointment.provider.location && (
            <>
              <>
                {/* removes falsy values from address array */}
                <span>{appointment.provider.location.address}</span>
              </>
              <div className="vads-u-margin-top--1 vads-u-color--link-default">
                <a
                  href={`https://maps.google.com?saddr=Current+Location&daddr=${
                    appointment.provider.location.address
                  }`}
                >
                  <va-icon icon="directions" size="3" />
                  Directions
                </a>
              </div>
            </>
          )}
          {appointment.provider.phoneNumber && (
            <>
              <br />
              <FacilityPhone contact={appointment.provider.phoneNumber} />
            </>
          )}
        </Section>
        <Section heading="Prepare for your appointment">
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            Bring your insurance cards. And bring a list of your medications
            other information to share with your provider.
          </p>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            <va-link
              text="Find a full list of things to bring to your appointment"
              href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"
            />
          </p>
        </Section>
        <Section heading="Need to make changes?">
          <span>
            Contact this provider if you need to reschedule or cancel your
            appointment.
          </span>
        </Section>
      </div>
    </PageLayout>
  );
}
