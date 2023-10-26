import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';

import {
  getAppointmentId,
  organizeAppointmentsByYearMonthDay,
} from '../utils/appointment';

import UpcomingAppointmentsListItem from './UpcomingAppointmentsListItem';

const UpcomingAppointmentsList = props => {
  const { router, app, upcomingAppointments } = props;
  const { jumpToPage } = useFormRouting(router);
  const { t } = useTranslation();

  const groupedAppointments = organizeAppointmentsByYearMonthDay(
    upcomingAppointments,
  );

  const handleDetailClick = (e, appointment) => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('details-link-clicked', 'nav', app),
    });
    jumpToPage(`appointment-details/${getAppointmentId(appointment)}`);
  };

  if (groupedAppointments.length < 1) {
    window.scrollTo(0, 0);
    return (
      <div data-testid="no-upcoming-appointments">
        You have no upcoming appointments
      </div>
    );
  }
  return (
    <>
      {groupedAppointments.map(month => {
        const { firstAppointmentStartTime, days } = month;
        const monthDate = new Date(firstAppointmentStartTime);
        return (
          <div key={firstAppointmentStartTime}>
            <h3 data-testid="appointments-list-monthyear-heading">
              {t('date-month-and-year', { date: monthDate })}
            </h3>
            <ul
              className="vads-u-margin-bottom--4 check-in--appointment-list appointment-list"
              data-testid="appointment-list"
            >
              {days.map((day, dayIndex) => {
                const { appointments } = day;
                return (
                  <React.Fragment key={dayIndex}>
                    {appointments.map((appointment, index) => {
                      return (
                        <UpcomingAppointmentsListItem
                          dayKey={index === 0}
                          key={`${appointment.appointmentIen}-${
                            appointment.stationNo
                          }`}
                          appointment={appointment}
                          goToDetails={handleDetailClick}
                          router={router}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
};

UpcomingAppointmentsList.propTypes = {
  app: PropTypes.string,
  router: PropTypes.object,
  upcomingAppointments: PropTypes.array,
};

export default UpcomingAppointmentsList;
