import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';

import {
  getAppointmentId,
  sortAppointmentsByStartTime,
} from '../utils/appointment';

import UpcomingAppointmentsListItem from './UpcomingAppointmentsListItem';

import { makeSelectVeteranData } from '../selectors';

const UpcomingAppointmentsList = props => {
  const { router, app } = props;
  const { jumpToPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { upcomingAppointments } = useSelector(selectVeteranData);

  const sortedAppointments = sortAppointmentsByStartTime(upcomingAppointments);

  const handleDetailClick = (e, appointment) => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('details-link-clicked', 'nav', app),
    });
    jumpToPage(`appointment-details/${getAppointmentId(appointment)}`);
  };

  if (sortedAppointments?.length < 1) {
    window.scrollTo(0, 0);
    return <div>You have no upcoming appointments ¯\_(ツ)_/¯</div>;
  }
  return sortedAppointments.map(appointment => {
    return (
      <UpcomingAppointmentsListItem
        key={`${appointment.appointmentIen}-${appointment.stationNo}`}
        appointment={appointment}
        goToDetails={handleDetailClick}
        router={router}
      />
    );
  });
};

UpcomingAppointmentsList.propTypes = {
  app: PropTypes.string,
  router: PropTypes.object,
};

export default UpcomingAppointmentsList;
