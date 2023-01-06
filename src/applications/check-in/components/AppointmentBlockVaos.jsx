import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import AppointmentListItem from './AppointmentListItem';
import { setActiveAppointment } from '../actions/universal';
import { useFormRouting } from '../hooks/useFormRouting';

const AppointmentBlockVaos = props => {
  const { appointments, page, router } = props;
  const { t } = useTranslation();
  const appointmentsDateTime = new Date(appointments[0].startTime);

  const dispatch = useDispatch();
  const { jumpToPage } = useFormRouting(router);

  const handleDetailClick = (appointmentIen, e) => {
    e.preventDefault();
    dispatch(setActiveAppointment(appointmentIen));
    jumpToPage('appointment-details');
  };

  return (
    <div>
      <p
        className="vads-u-font-family--serif"
        data-testid="appointment-day-location"
      >
        {t('your-appointments-on-day', {
          count: appointments.length,
          day: appointmentsDateTime,
        })}
      </p>
      <ol
        className="vads-u-border-top--1px vads-u-margin-bottom--4 check-in--appointment-list"
        data-testid="appointment-list"
      >
        {appointments.map(appointment => {
          return (
            <AppointmentListItem
              key={`${appointment.appointmentIen}-${appointment.stationNo}`}
              appointment={appointment}
              goToDetails={page === 'confirmation' ? handleDetailClick : null}
            />
          );
        })}
      </ol>
    </div>
  );
};

AppointmentBlockVaos.propTypes = {
  appointments: PropTypes.array.isRequired,
  page: PropTypes.string.isRequired,
  router: PropTypes.object,
};

export default AppointmentBlockVaos;
