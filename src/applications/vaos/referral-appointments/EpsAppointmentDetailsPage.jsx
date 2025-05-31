import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { format } from 'date-fns';

import { fetchAppointmentInfo, setFormCurrentPage } from './redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import { getReferralAppointmentInfo } from './redux/selectors';

// eslint-disable-next-line import/no-restricted-paths
import PageLayout from '../appointment-list/components/PageLayout';
import FullWidthLayout from '../components/FullWidthLayout';
import Section from '../components/Section';
// eslint-disable-next-line import/no-restricted-paths
import { AppointmentTime } from '../appointment-list/components/AppointmentDateTime';
import ProviderAddress from './components/ProviderAddress';

export default function EpsAppointmentDetailsPage() {
  const { pathname } = useLocation();
  // get the id from the url my-health/appointments/1234
  const [, appointmentId] = pathname.split('/');
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    appointmentInfoError,
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
      appointmentInfoLoading,
      referralAppointmentInfo,
    ],
  );
  if (appointmentInfoError) {
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
      <div className="vaos-hide-for-print mobile:vads-u-margin-bottom--0 mobile-lg:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
        <nav aria-label="backlink" className="vads-u-padding-y--2 ">
          <va-link
            back
            aria-label="Back link"
            data-testid="back-link"
            text="Back to appointments"
            href="/my-health/appointments"
            onClick={e => {
              e.preventDefault();
              history.push('/');
            }}
          />
        </nav>
      </div>
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
        <Section heading="Provider">
          <span>
            {`${appointment.provider.location.name ||
              'Provider information not available'}`}
          </span>
          <br />
          {appointment.provider.location.address && (
            <ProviderAddress
              address={appointment.provider.location.address}
              showDirections
              directionsName={appointment.provider.location.name}
              phone={appointment.provider.phone}
            />
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
