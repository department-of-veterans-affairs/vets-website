import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { locationShouldBeDisplayed } from '../utils/appointment';

const AppointmentBlock = props => {
  const { appointments, page } = props;
  const { t } = useTranslation();

  const appointmentsDateTime = new Date(appointments[0].startTime);

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
        {appointments.map((appointment, index) => {
          const appointmentDateTime = new Date(appointment.startTime);
          const clinic = appointment.clinicFriendlyName
            ? appointment.clinicFriendlyName
            : appointment.clinicName;
          return (
            <li
              key={index}
              className="vads-u-border-bottom--1px check-in--appointment-item"
              data-testid="appointment-list-item"
            >
              <div className="check-in--appointment-summary vads-u-margin-bottom--2 vads-u-margin-top--2">
                <div className="vads-u-margin-right--1 check-in--label">
                  <i
                    aria-label="Appointment type"
                    className={`fas ${
                      appointment?.kind === 'phone' ? 'fa-phone' : 'fa-building'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <div
                  data-testid="appointment-type-label"
                  className="check-in--value vads-u-font-weight--bold"
                >
                  {appointment?.kind === 'phone' ? 'Phone call' : 'In person'}
                </div>
                {appointment?.kind !== 'phone' && (
                  <>
                    <div className="check-in--label vads-u-margin-right--1">
                      Facility:
                    </div>
                    <div
                      className="check-in--value"
                      data-testid="facility-name"
                    >
                      {appointment.facility}
                    </div>
                  </>
                )}
                <div className="check-in--label vads-u-margin-right--1">
                  {t('time')}:
                </div>
                <div className="check-in--value" data-testid="appointment-time">
                  {t('date-time', { date: appointmentDateTime })}
                </div>
                <div className="check-in--label vads-u-margin-right--1">
                  {t('type-of-care')}:
                </div>
                <div className="check-in--value" data-testid="type-of-care">
                  {appointment.clinicStopCodeName ?? t('VA-appointment')}
                </div>
                {appointment.doctorName && (
                  <>
                    <div className="check-in--label vads-u-margin-right--1">
                      {t('provider')}:
                    </div>
                    <div className="check-in--value" data-testid="provider">
                      {appointment.doctorName}
                    </div>
                  </>
                )}
                <div className="check-in--label vads-u-margin-right--1">
                  {t('clinic')}:
                </div>
                <div
                  className="check-in--value"
                  data-testid="appointment-clinic"
                >
                  {clinic}
                </div>
                {locationShouldBeDisplayed(appointment) && (
                  <>
                    <div className="check-in--label vads-u-margin-right--1">
                      {t('location')}:
                    </div>
                    <div
                      className="check-in--value"
                      data-testid="clinic-location"
                    >
                      {appointment.clinicLocation}
                    </div>
                  </>
                )}
              </div>
              {page === 'confirmation' || appointment?.kind === 'phone' ? (
                <va-alert
                  background-only
                  show-icon
                  data-testid="appointment-message"
                  class="vads-u-margin-bottom--2"
                >
                  <div>
                    {appointment?.kind === 'phone'
                      ? `${t('your-provider-will-call-you')} ${
                          page === 'confirmation'
                            ? t('you-may-need-to-wait')
                            : ''
                        }`
                      : t(
                          'please-bring-your-insurance-cards-with-you-to-your-appointment',
                        )}
                  </div>
                </va-alert>
              ) : (
                ''
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

AppointmentBlock.propTypes = {
  appointments: PropTypes.array.isRequired,
  page: PropTypes.string.isRequired,
};

export default AppointmentBlock;
