import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import AddToCalendarButton from '../../../components/AddToCalendarButton';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import Section from '../../../components/Section';
import AppointmentDate from '../../../components/AppointmentDate';
import AppointmentTime from '../../../components/AppointmentTime';

// eslint-disable-next-line import/no-restricted-paths
import ProviderAddress from '../../../referral-appointments/components/ProviderAddress';
import { Details } from '../../../components/layouts/DetailPageLayout';
import FacilityPhone from '../../../components/FacilityPhone';

export default function EpsAppointmentDetailCard({
  appointment,
  pageTitle,
  isPastAppointment,
  featureCommunityCareCancellations,
  onSetCancelAppointment,
}) {
  const facility = {
    name: appointment.provider.location.name,
    address: appointment.provider.location.address,
    phone: appointment.provider.phone,
    website: appointment.provider.location.website,
    timezone: appointment.provider.location.timezone,
    practiceName: appointment.provider.location.name,
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
        {featureCommunityCareCancellations && (
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
