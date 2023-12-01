import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeSelectApp } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';

import ActionLink from './ActionLink';
import {
  getAppointmentId,
  getCheckinableAppointments,
  sortAppointmentsByStartTime,
} from '../utils/appointment';

const WhatToDoNext = props => {
  const { router, appointments, action, goToDetails } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();

  const sortedAppointments = sortAppointmentsByStartTime(appointments);
  const checkInableAppointments = getCheckinableAppointments(
    sortedAppointments,
  );
  const appointmentCards =
    app === APP_NAMES.PRE_CHECK_IN
      ? [checkInableAppointments[0]]
      : checkInableAppointments;

  const getPreCheckinCardTitle = () => {
    let title = `${t('review-your-contact-information-for-your')} `;
    if (checkInableAppointments.length > 1) {
      checkInableAppointments.forEach((appointment, index) => {
        title += t('day-of-week-month-day-time', {
          date: new Date(appointment.startTime),
        });
        if (index === appointments.length - 2) {
          title += ` ${t('and')} `;
        }
        if (index < appointments.length - 2) {
          title += ', ';
        }
      });
      title += ` ${t('appointments')}`;
    } else {
      title = t('review-your-contact-information-for-your-appointment', {
        date: new Date(appointments[0].startTime),
      });
    }
    return title;
  };

  return (
    <>
      <h2 data-testid="what-next-header">{t('what-to-do-next')}</h2>
      {appointmentCards.map((appointment, index) => {
        const cardTitleId = `what-next-card-title-${index}`;
        let cardTitle = t('its-time-to-check-in-for-your-time-appointment', {
          time: new Date(appointment.startTime),
        });
        if (app === APP_NAMES.PRE_CHECK_IN) {
          cardTitle = getPreCheckinCardTitle();
        }
        return (
          <div
            className="vads-u-margin-bottom--2"
            key={appointment.appointmentIen}
            data-testid="what-next-card"
          >
            <va-card show-shadow={checkInableAppointments.length > 1}>
              <h4
                className="vads-u-margin-top--0"
                data-testid="what-next-card-title"
                id={cardTitleId}
              >
                {cardTitle}
              </h4>
              <p>
                <a
                  data-testid={`details-link-${index}`}
                  href={`${
                    router.location.basename
                  }/appointment-details/${getAppointmentId(appointment)}`}
                  onClick={e => goToDetails(e, appointment)}
                  aria-label={t('details-for-appointment', {
                    time: new Date(appointment.startTime),
                    type: appointment.clinicStopCodeName
                      ? appointment.clinicStopCodeName
                      : 'VA',
                  })}
                >
                  {t('details')}
                </a>
              </p>
              <ActionLink
                app={app}
                action={action}
                cardTitleId={cardTitleId}
                startTime={appointment.startTime}
                appointmentId={getAppointmentId(appointment)}
              />
            </va-card>
          </div>
        );
      })}
    </>
  );
};

WhatToDoNext.propTypes = {
  action: PropTypes.func.isRequired,
  appointments: PropTypes.array.isRequired,
  goToDetails: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
};

export default WhatToDoNext;
