import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { useGetAppointmentInfoQuery } from '../redux/api/vaosApi';
import { setFormCurrentPage } from './redux/actions';
// eslint-disable-next-line import/no-restricted-paths

// eslint-disable-next-line import/no-restricted-paths
import PageLayout from '../appointment-list/components/PageLayout';
import FullWidthLayout from '../components/FullWidthLayout';
import Section from '../components/Section';
import AppointmentDate from '../components/AppointmentDate';
import AppointmentTime from '../components/AppointmentTime';
import ProviderAddress from './components/ProviderAddress';

export default function EpsAppointmentDetailsPage() {
  const { pathname } = useLocation();
  // get the id from the url my-health/appointments/1234
  const [, appointmentId] = pathname.split('/');
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(setFormCurrentPage('details'));
    },
    [dispatch],
  );
  const {
    data: referralAppointmentInfo,
    isError,
    isLoading,
  } = useGetAppointmentInfoQuery(appointmentId);

  if (isError) {
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
  if (isLoading || !referralAppointmentInfo?.attributes) {
    return (
      <FullWidthLayout>
        <va-loading-indicator set-focus message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  const { attributes: appointment } = referralAppointmentInfo;

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
          <span data-dd-privacy="mask">Community Care Appointment</span>
        </h1>
        <Section heading="When">
          <AppointmentDate date={appointment.start} />
          <br />
          <AppointmentTime
            date={appointment.start}
            timezone={appointment.provider.location.timezone}
          />
        </Section>
        <Section heading="Provider">
          <span data-dd-privacy="mask">
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
            Bring your insurance cards, a list of your medications, and other
            things to share with your provider
          </p>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            <va-link
              text="Find out what to bring to your appointment"
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
