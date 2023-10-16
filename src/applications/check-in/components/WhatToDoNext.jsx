import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeSelectApp } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';

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

  const ActionLink = () => {
    const linkText =
      app === APP_NAMES.PRE_CHECK_IN
        ? t('review-your-information-now')
        : t('check-in-now');
    const ariaLabel =
      app === APP_NAMES.PRE_CHECK_IN
        ? t('review-your-information-now')
        : t('check-in-now-for-your-appointment');
    return (
      <p className="vads-u-margin-bottom--0">
        <a
          data-testid="action-link"
          className="vads-c-action-link--green"
          href="/"
          aria-label={ariaLabel}
          onClick={e => action(e)}
        >
          {linkText}
        </a>
      </p>
    );
  };

  return (
    <>
      <h2 data-testid="what-next-header">{t('what-to-do-next')}</h2>
      {checkInableAppointments.map(appointment => {
        let cardTitle = t('its-time-to-check-in-for-your-time-appointment', {
          time: new Date(appointment.startTime),
        });
        if (app === APP_NAMES.PRE_CHECK_IN) {
          cardTitle = t(
            'review-your-contact-information-for-your-appointment',
            {
              date: new Date(appointment.startTime),
            },
          );
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
              >
                {cardTitle}
              </h4>
              <p>
                <a
                  data-testid="details-link"
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
              <ActionLink />
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
