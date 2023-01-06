import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { setActiveAppointment } from '../actions/universal';
import { useFormRouting } from '../hooks/useFormRouting';
import { appointmentIcon, clinicName } from '../utils/appointment';

const AppointmentBlockVaos = props => {
  const { appointments, page, router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const appointmentsDateTime = new Date(appointments[0].startTime);
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
        {appointments.map((appointment, index) => {
          const appointmentDateTime = new Date(appointment.startTime);
          const clinic = clinicName(appointment);
          return (
            <li
              key={index}
              className="vads-u-border-bottom--1px check-in--appointment-item"
              data-testid="appointment-list-item"
            >
              <div className="check-in--appointment-summary vads-u-margin-bottom--2 vads-u-margin-top--2">
                <div className="vads-u-font-size--h2 vads-u-font-family--serif">
                  {t('date-time', { date: appointmentDateTime })}
                </div>
                <div className="vads-u-font-weight--bold">
                  {appointment.clinicStopCodeName ?? t('VA-appointment')}
                  {appointment.doctorName
                    ? ` ${t('with')} ${appointment.doctorName}`
                    : ''}
                </div>
                <div>
                  <div className="vads-u-margin-right--1 check-in--label">
                    {appointmentIcon(appointment)}
                  </div>
                  <div className="vads-u-display--inline">
                    {appointment?.kind === 'phone' ? (
                      t('phone')
                    ) : (
                      <>
                        {`${t('in-person')} at ${appointment.facility}`} <br />{' '}
                        Clinic: {clinic}
                      </>
                    )}
                  </div>
                  {page === 'confirmation' && (
                    <div>
                      <a
                        data-testid="details-link"
                        href="#details"
                        onClick={e =>
                          handleDetailClick(appointment.appointmentIen, e)
                        }
                      >
                        Details
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </li>
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
