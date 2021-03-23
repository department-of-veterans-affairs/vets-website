import React from 'react';
import PropTypes from 'prop-types';
import { differenceInDays, format } from 'date-fns';
import CTALink from '../CTALink';
import { recordDashboardClick } from '~/applications/personalization/dashboard/helpers';

export const Appointments = ({ appointments }) => {
  const nextAppointment = appointments?.[0];
  const start = new Date(nextAppointment?.startsAt);
  const today = new Date();
  const hasUpcomingAppointment = differenceInDays(start, today) < 30;

  const hasFutureAppointments = appointments?.length;
  const noUpcomingAppointmentsCopy =
    'You have no appointments scheduled in the next 30 days.';

  let locationName;

  if (nextAppointment?.isVideo) {
    locationName = 'VA Video Connect';

    if (nextAppointment?.additionalInfo) {
      locationName += ` ${nextAppointment.additionalInfo}`;
    }
  }

  if (!nextAppointment?.isVideo) {
    locationName = nextAppointment?.providerName;
  }

  const cardDetails = {
    ctaIcon: 'calendar',
    ctaHref: '/health-care/schedule-view-va-appointments/appointments',
    ctaAriaLabel: 'Manage all appointments',
    ctaOnClick: recordDashboardClick('manage-all-appointments'),
    ctaText: 'Manage all appointments',
  };

  // has an upcoming appointment in the next 30 days
  if (hasFutureAppointments) {
    cardDetails.cardTitle = 'Next appointment';
    cardDetails.line1 = format(start, 'EEEE, MMMM Mo, yyyy');
    cardDetails.line2 = `Time: ${format(start, 'h:mm aaaa')} ${
      nextAppointment?.timeZone
    }`;
    cardDetails.line3 = locationName;
  }

  // has appointments but not in the next 30 days
  if (hasFutureAppointments && !hasUpcomingAppointment) {
    cardDetails.cardTitle = '';
    cardDetails.line1 = noUpcomingAppointmentsCopy;
  }

  // has no appointments scheduled
  if (!hasFutureAppointments) {
    cardDetails.cardTitle = '';
    cardDetails.line1 = noUpcomingAppointmentsCopy;
  }

  if (!nextAppointment) {
    return null;
  }

  const standardClass = 'vads-u-padding-y--2p5 vads-u-padding-x--2p5';
  const backgroundClasses = !hasUpcomingAppointment
    ? standardClass
    : `vads-u-background-color--gray-lightest ${standardClass}`;

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-flex--1 vads-u-margin-right--3">
      <div className={backgroundClasses}>
        <h4 className="vads-u-margin-top--0 vads-u-font-size--h3">
          {cardDetails?.cardTitle}
        </h4>
        <p>{cardDetails?.line1}</p>
        {hasUpcomingAppointment && (
          <>
            <p>{cardDetails?.line2}</p>
            <p>{cardDetails?.line3}</p>
          </>
        )}
        <CTALink
          text={cardDetails.ctaText}
          icon={cardDetails.ctaIcon}
          href={cardDetails.ctaHref}
          ariaLabel={cardDetails.ctaAriaLabel}
        />
      </div>
    </div>
  );
};

Appointments.propTypes = {
  authenticatedWithSSOe: PropTypes.bool.isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      additionalInfo: PropTypes.string,
      facility: PropTypes.object,
      id: PropTypes.string.isRequired,
      isVideo: PropTypes.bool.isRequired,
      providerName: PropTypes.string,
      startsAt: PropTypes.string.isRequired,
      timeZone: PropTypes.string,
      type: PropTypes.string.isRequired,
    }),
  ),
};

export default Appointments;
