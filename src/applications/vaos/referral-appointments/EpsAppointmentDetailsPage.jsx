import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation, useHistory } from 'react-router-dom';
import AddToCalendarButton from '../components/AddToCalendarButton';
import { useGetAppointmentInfoQuery } from '../redux/api/vaosApi';
import { setFormCurrentPage } from './redux/actions';
import { APPOINTMENT_STATUS } from '../utils/constants';
import { selectFeatureCommunityCareCancellations } from '../redux/selectors';

// eslint-disable-next-line import/no-restricted-paths
import PageLayout from '../appointment-list/components/PageLayout';
import FullWidthLayout from '../components/FullWidthLayout';
import Section from '../components/Section';
import AppointmentDate from '../components/AppointmentDate';
import AppointmentTime from '../components/AppointmentTime';
import ProviderAddress from './components/ProviderAddress';
import { Details } from '../components/layouts/DetailPageLayout';
import FacilityPhone from '../components/FacilityPhone';

export default function EpsAppointmentDetailsPage() {
  const { pathname } = useLocation();
  // get the id from the url my-health/appointments/1234
  const [, appointmentId] = pathname.split('/');
  const history = useHistory();
  const dispatch = useDispatch();
  const featureCommunityCareCancellations = useSelector(
    selectFeatureCommunityCareCancellations,
  );

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
            data-testid="error-alert"
            class="vads-u-margin-bottom--2"
          >
            <h3>We’re sorry, we can’t find your appointment</h3>
            <p>
              Try searching this appointment on your appointment list or call
              your your facility.
            </p>
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
  const isPastAppointment = appointment.past;

  const backLink = isPastAppointment
    ? '/my-health/appointments/past'
    : '/my-health/appointments';

  const backLinkText = isPastAppointment
    ? 'Back to past appointments'
    : 'Back to appointments';

  const pageTitle = isPastAppointment
    ? 'Past community care appointment'
    : 'Community care appointment';

  const facility = {
    name: appointment.provider.location.name,
    address: appointment.provider.location.address,
    phone: appointment.provider.phone,
    website: appointment.provider.location.website,
    timezone: appointment.provider.location.timezone,
    practiceName: appointment.provider.location.name,
  };

  const calendarData = {
    vaos: {
      isCommunityCare: true,
    },
    ...appointment,
    minutesDuration: appointment.minutesDuration ?? 30,
    start: new Date(appointment.start),
    communityCareProvider: { ...facility },
  };

  return (
    <PageLayout showNeedHelp>
      <div className="vaos-hide-for-print mobile:vads-u-margin-bottom--0 mobile-lg:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
        <nav aria-label="backlink" className="vads-u-padding-y--2 ">
          <va-link
            back
            aria-label="Back link"
            data-testid="back-link"
            text={backLinkText}
            href={backLink}
            onClick={e => {
              e.preventDefault();
              history.push(isPastAppointment ? '/past' : '/');
            }}
          />
        </nav>
      </div>
      <va-card
        className="vaos-appts__appointment-details--container vads-u-margin-top--4 vads-u-border--2px vads-u-border-color--gray-medium vads-u-padding-x--2p5 vads-u-padding-top--5 vads-u-padding-bottom--3"
        data-testid="appointment-card"
        icon-name="calendar_today"
      >
        <h1 className="vaos__dynamic-font-size--h2">
          <span data-dd-privacy="mask">{pageTitle}</span>
        </h1>
        <Section heading="When">
          <AppointmentDate
            date={appointment.start}
            timezone={appointment.provider.location.timezone}
          />
          <br />
          <AppointmentTime
            date={appointment.start}
            timezone={appointment.provider.location.timezone}
          />
          {APPOINTMENT_STATUS.cancelled !== appointment.status &&
            !isPastAppointment && (
              <div className="vads-u-margin-top--1 vaos-hide-for-print">
                <AddToCalendarButton appointment={calendarData} />
              </div>
            )}
        </Section>
        <Section heading="Provider">
          {appointment.provider?.name ? (
            <p
              className="vads-u-margin-top--0 vads-u-margin-bottom--0"
              data-dd-privacy="mask"
            >
              {appointment.provider.name}
            </p>
          ) : (
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              Provider name not available
            </p>
          )}
          {appointment.provider?.location?.name ? (
            <p
              className="vads-u-margin-top--0 vads-u-margin-bottom--0"
              data-dd-privacy="mask"
            >
              {appointment.provider.location.name}
            </p>
          ) : (
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              Facility name not available
            </p>
          )}
          {appointment.provider.location.address ? (
            <ProviderAddress
              address={appointment.provider.location.address}
              showDirections
              directionsName={appointment.provider.location.name}
            />
          ) : (
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              Address not available
            </p>
          )}
          <FacilityPhone
            // If provider phone is available, use it, otherwise VA 800 number
            contact={appointment.provider.phone || undefined}
            // If provider phone is available, hide extension
            ccPhone={!!appointment.provider.phone}
          />
        </Section>
        <Details
          reason={appointment.reason}
          otherDetails={appointment.comments}
        />
        <Section heading="Prepare for your appointment">
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            Bring your insurance cards. And bring a list of your medications and
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
        <div
          className="vads-u-display--flex vads-u-margin-top--4 vaos-appts__block-label vaos-hide-for-print vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row"
          style={{ rowGap: '16px' }}
        >
          <div>
            <VaButton
              text="Print"
              secondary
              onClick={() => window.print()}
              data-testid="print-button"
              uswds
            />
          </div>
          {featureCommunityCareCancellations && (
            <div>
              <VaButton
                text="Cancel appointment"
                secondary
                onClick={e => {
                  // Add cancel appointment flow:
                  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/122917
                  e.preventDefault();
                }}
                data-testid="cancel-button"
                uswds
              />
            </div>
          )}
        </div>
      </va-card>
    </PageLayout>
  );
}
