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
              <h4
                className="vads-u-text-align--center vads-u-line-height--2 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-top--2"
                data-testid="day-label"
              >
                <span className="vads-u-font-size--md vads-u-font-weight--bold">
                  {`${t('date-day-of-month', { date: appointmentDateTime })} `}
                </span>
                <br />
                {t('date-day-of-week', { date: appointmentDateTime })}
              </h4>
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
                    {t('in-person')} {appointment.facility}
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
                aria-label={t('details-for-appointment-on-date-at-time', {
                  dateTime: appointmentDateTime,
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
