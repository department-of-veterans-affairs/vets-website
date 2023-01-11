import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { appointmentIcon, clinicName } from '../utils/appointment';

const AppointmentListItemVaos = props => {
  const {
    appointment,
    goToDetails,
    AppointmentAction,
    showDetailsLink,
  } = props;
  const { t } = useTranslation();

  const appointmentDateTime = new Date(appointment.startTime);
  const clinic = clinicName(appointment);
  return (
    <li
      className="vads-u-border-bottom--1px check-in--appointment-item"
      data-testid="appointment-list-item"
    >
      <div className="check-in--appointment-summary vads-u-margin-bottom--2 vads-u-margin-top--2">
        <div
          data-testid="appointment-time"
          className="vads-u-font-size--h2 vads-u-font-family--serif vads-u-font-weight--bold"
        >
          {t('date-time', { date: appointmentDateTime })}
        </div>
        <div
          data-testid="appointment-type-and-provider"
          className="vads-u-font-weight--bold"
        >
          {appointment.clinicStopCodeName ?? t('VA-appointment')}
          {appointment.doctorName
            ? ` ${t('with')} ${appointment.doctorName}`
            : ''}
        </div>
        <div className="vads-u-display--flex vads-u-align-items--baseline">
          <div
            data-testid="appointment-kind-icon"
            className="vads-u-margin-right--1 check-in--label"
          >
            {appointmentIcon(appointment)}
          </div>
          <div
            data-testid="appointment-kind-and-location"
            className="vads-u-display--inline"
          >
            {appointment?.kind === 'phone' ? (
              t('phone')
            ) : (
              <>
                {`${t('in-person')} at ${appointment.facility}`} <br /> Clinic:{' '}
                {clinic}
              </>
            )}
          </div>
        </div>
        {showDetailsLink && (
          <div className="vads-u-margin-y--2">
            <a
              data-testid="details-link"
              href="#details"
              onClick={e => goToDetails(appointment.appointmentIen, e)}
            >
              Details
            </a>
          </div>
        )}
        {AppointmentAction}
      </div>
    </li>
  );
};

AppointmentListItemVaos.propTypes = {
  appointment: PropTypes.object.isRequired,
  AppointmentAction: PropTypes.node,
  goToDetails: PropTypes.func,
  showDetailsLink: PropTypes.bool,
};

export default AppointmentListItemVaos;
