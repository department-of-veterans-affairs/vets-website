import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import Section from '../../../components/Section';
import InfoAlert from '../../../components/InfoAlert';

// eslint-disable-next-line import/no-restricted-paths
import { Details } from '../../../components/layouts/DetailPageLayout';
import AppointmentDateTime from '../../../components/AppointmentDateTime';
import AppointmentFacilityLocation from '../../../components/AppointmentFacilityLocation';

export default function EpsAppointmentDetailCard({
  appointment,
  pageTitle,
  isPastAppointment,
  featureCommunityCareCancellations,
  onSetCancelAppointment,
}) {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const facility = {
    name: appointment.provider?.location?.name,
    address: appointment.provider?.location?.address,
    phone: appointment.provider?.phone,
    website: appointment.provider?.location?.website,
    timezone: appointment.provider?.location?.timezone || browserTimezone,
    practiceName: appointment.provider?.location?.name,
  };
  const defaultMinutesDuration = 30;
  const calendarData = {
    vaos: {
      isCommunityCare: true,
    },
    ...appointment,
    minutesDuration: appointment.minutesDuration ?? defaultMinutesDuration,
    start: new Date(appointment.start),
    communityCareProvider: { ...facility },
  };
  return (
    <va-card
      className="vaos-appts__appointment-details--container vads-u-margin-top--4 vads-u-border--2px vads-u-border-color--gray-medium vads-u-padding-x--2p5 vads-u-padding-top--5 vads-u-padding-bottom--3"
      data-testid="appointment-card"
      icon-name="calendar_today"
    >
      <h1 className="vaos__dynamic-font-size--h2">
        <span data-dd-privacy="mask">{pageTitle}</span>
      </h1>
      {appointment.status === APPOINTMENT_STATUS.cancelled && (
        <InfoAlert
          status="error"
          backgroundOnly
          className="vads-u-margin-top--2"
        >
          <p>
            <strong>
              {appointment.cancelationReason?.coding?.[0]?.code === 'pat'
                ? 'You'
                : appointment.provider?.location?.name || 'The facility'}{' '}
              canceled this appointment.
            </strong>{' '}
            If you want to reschedule, call us or schedule a new appointment
            online. <br />
            <br />
            <va-link
              href={`/my-health/appointments/schedule-referral?id=${
                appointment.referralId
              }&referrer=referrals-requests`}
              text="Go to your referral to schedule an appointment"
            />
            .
          </p>
        </InfoAlert>
      )}
      <Section heading="When">
        <AppointmentDateTime
          start={appointment.start}
          timezone={appointment.provider?.location?.timezone || browserTimezone}
          calendarData={calendarData}
          showAddToCalendarButton={
            APPOINTMENT_STATUS.cancelled !== appointment.status &&
            !isPastAppointment
          }
        />
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
        <AppointmentFacilityLocation
          locationName={appointment.provider?.location?.name}
          locationAddress={appointment.provider?.location?.address}
          locationPhone={appointment.provider?.phone}
        />
      </Section>
      <Details otherDetails={appointment.comments} />
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
      <div className="vads-u-display--flex vads-u-margin-top--4 vads-u-row-gap--2 vaos-appts__block-label vaos-hide-for-print vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row vaos-form__button-container">
        <div>
          <VaButton
            text="Print"
            secondary
            onClick={() => window.print()}
            data-testid="print-button"
            uswds
          />
        </div>
        {featureCommunityCareCancellations &&
          APPOINTMENT_STATUS.cancelled !== appointment.status &&
          !isPastAppointment && (
            <div>
              <VaButton
                text="Cancel appointment"
                secondary
                onClick={() => {
                  onSetCancelAppointment();
                }}
                data-testid="cancel-button"
                uswds
              />
            </div>
          )}
      </div>
    </va-card>
  );
}

EpsAppointmentDetailCard.propTypes = {
  appointment: PropTypes.object.isRequired,
  featureCommunityCareCancellations: PropTypes.bool.isRequired,
  isPastAppointment: PropTypes.bool.isRequired,
  pageTitle: PropTypes.string.isRequired,
  onSetCancelAppointment: PropTypes.func.isRequired,
};
