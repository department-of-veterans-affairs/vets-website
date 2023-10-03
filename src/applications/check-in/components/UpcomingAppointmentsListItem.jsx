import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  appointmentIcon,
  clinicName,
  getAppointmentId,
} from '../utils/appointment';

const UpcomingAppointmentsListItem = props => {
  const { appointment, goToDetails, dayKey, router } = props;
  const { t } = useTranslation();
  const appointmentDateTime = new Date(appointment.startTime);
  const clinic = clinicName(appointment);

  return (
    <li
      className="check-in--appointment-item"
      data-testid="appointment-list-item"
    >
      <div className="vads-l-grid-container vads-u-padding-x--0">
        <div className="vads-l-row">
          <div
            className={`vads-l-col--2${
              dayKey ? ' vads-u-border-top--1px' : ''
            }`}
          >
            {dayKey && (
              <div
                className="vads-u-text-align--center"
                data-testid="day-label"
              >
                <p className="vads-u-line-height--2">
                  {`${t('date-day-of-week', { date: appointmentDateTime })} `}
                  <br />
                  <span className="vads-u-font-size--md vads-u-font-weight--bold">
                    {t('date-day-of-month', { date: appointmentDateTime })}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="vads-l-col--10 vads-u-border-top--1px">
            <div
              className="vads-u-margin-top--1p5"
              data-testid="appointment-time"
            >
              {t('date-time', { date: appointmentDateTime })}
            </div>
            <div
              data-testid="appointment-type-and-provider"
              className="vads-u-font-weight--bold"
            >
              {appointment.clinicStopCodeName
                ? appointment.clinicStopCodeName
                : t('VA-appointment')}
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
                    {t('in-person')} at {appointment.facility}
                  </>
                )}
              </div>
            </div>
            <div>
              {appointment?.kind === 'clinic' && (
                <>
                  {t('clinic')}: {clinic}
                </>
              )}
            </div>

            <div className="vads-u-margin-y--1p5">
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
      </div>
    </li>
  );
};

UpcomingAppointmentsListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  dayKey: PropTypes.bool,
  goToDetails: PropTypes.func,
  router: PropTypes.object,
};

export default UpcomingAppointmentsListItem;
