import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';

import {
  getAppointmentId,
  organizeAppointmentsByYearMonthDay,
} from '../utils/appointment';

import UpcomingAppointmentsListItem from './UpcomingAppointmentsListItem';

import { makeSelectVeteranData } from '../selectors';

const UpcomingAppointmentsList = props => {
  const { router, app } = props;
  const { jumpToPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { upcomingAppointments } = useSelector(selectVeteranData);

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
    return <div>You have no upcoming appointments</div>;
  }
  return (
    <>
      {groupedAppointments.map(month => {
        const { monthYearKey, days } = month;

        return (
          <div key={monthYearKey}>
            <h3>
              {`${monthYearKey.split('-')[1]} ${monthYearKey.split('-')[0]}`}
            </h3>
            <ul
              className="vads-u-margin-bottom--4 check-in--appointment-list appointment-list"
              data-testid="appointment-list"
            >
              {days.map(day => {
                const { appointments, dayKey } = day;
                return (
                  <>
                    {appointments.map((appointment, index) => {
                      const dayKeyString = index === 0 ? dayKey : null;
                      return (
                        <UpcomingAppointmentsListItem
                          dayKey={dayKeyString}
                          key={`${appointment.appointmentIen}-${
                            appointment.stationNo
                          }`}
                          app={app}
                          appointment={appointment}
                          goToDetails={handleDetailClick}
                          router={router}
                        />
                      );
                    })}
                  </>
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
};

export default UpcomingAppointmentsList;
