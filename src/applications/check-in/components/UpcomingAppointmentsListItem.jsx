import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { getAppointmentId } from '../utils/appointment';

const UpcomingAppointmentsListItem = props => {
  const { appointment, goToDetails, router } = props;
  const { t } = useTranslation();
  const appointmentDateTime = new Date(appointment.startTime);

  return (
    <li
      className="vads-u-border-bottom--1px check-in--appointment-item"
      data-testid="appointment-list-item"
    >
      <div className="vads-l-grid-container">
        <div className="vads-l-row">
          <div className="vads-l-col--2 site-grid-example">
            <p>Fri</p>
            <p>3</p>
          </div>
          <div className="vads-l-col--10 site-grid-example">
            <p>{appointment.clinicName}</p>
            <a
              data-testid="details-link"
              href={`${
                router.location.basename
              }/appointment-details/${getAppointmentId(appointment)}`}
              onClick={e => goToDetails(e, appointment)}
              aria-label={t('details-for-appointment', {
                time: appointmentDateTime,
                type: appointment.clinicStopCodeName
                  ? appointment.clinicStopCodeName
                  : 'VA',
              })}
            >
              {t('details')}
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};

UpcomingAppointmentsListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  goToDetails: PropTypes.func,
  router: PropTypes.object,
};

export default UpcomingAppointmentsListItem;
