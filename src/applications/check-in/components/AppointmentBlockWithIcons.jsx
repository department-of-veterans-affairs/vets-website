import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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
        className="vads-u-border-top--1px vads-u-margin-bottom--4 pre-check-in--appointment-list"
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
              className="vads-u-border-bottom--1px pre-check-in--appointment-item"
              data-testid={`appointment-list-item-${index}`}
            >
              <dl className="pre-check-in--appointment-summary">
                <dt className="pre-check-in--label vads-u-margin-right--1 appointment-type-label">
                  <i
                    aria-label="Appointment type"
                    className={`fas ${
                      appointment?.kind === 'phone' ? 'fa-phone' : 'fa-building'
                    }`}
                  />
                </dt>
                <dd
                  className="appointment-type-label vads-u-margin-left--2p5 vads-u-font-weight--bold"
                  data-testid="appointment-type-label"
                >
                  {appointment?.kind === 'phone' ? 'Phone call' : 'In person'}
                </dd>
                {appointment?.kind !== 'phone' && (
                  <>
                    <dt className="pre-check-in--label vads-u-margin-right--1">
                      Facility:
                    </dt>
                    <dd
                      className="pre-check-in--value"
                      data-testid="facility-name"
                    >
                      {appointment.facility}
                    </dd>
                  </>
                )}
                <dt className="pre-check-in--label vads-u-margin-right--1">
                  {t('time')}:
                </dt>
                <dd
                  className="pre-check-in--value"
                  data-testid="appointment-time"
                >
                  {t('date-time', { date: appointmentDateTime })}
                </dd>
                <dt className="pre-check-in--label vads-u-margin-right--1">
                  {t('clinic')}:
                </dt>
                <dd
                  className="pre-check-in--value"
                  data-testid="appointment-clinic"
                >
                  {clinic}
                </dd>
              </dl>
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
