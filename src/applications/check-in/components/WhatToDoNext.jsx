import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';
import { makeSelectApp } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';

import {
  getAppointmentId,
  getCheckinableAppointments,
  sortAppointmentsByStartTime,
} from '../utils/appointment';

const WhatToDoNext = props => {
  const { router, appointments } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { goToNextPage, jumpToPage } = useFormRouting(router);
  const { t } = useTranslation();

  const sortedAppointments = sortAppointmentsByStartTime(appointments);
  const checkInableAppointments = getCheckinableAppointments(
    sortedAppointments,
  );

  const handleClick = e => {
    e.preventDefault();
    goToNextPage();
  };

  const goToDetails = (e, appointment) => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('details-link-clicked', 'nav', app),
    });
    jumpToPage(`appointment-details/${getAppointmentId(appointment)}`);
  };

  const ActionLink = () => {
    const linkText =
      app === APP_NAMES.PRE_CHECK_IN
        ? t('review-your-information-now')
        : t('check-in-now');
    const ariaLabel =
      app === APP_NAMES.PRE_CHECK_IN
        ? t('review-your-information-now')
        : t('check-in-now');
    return (
      <p className="vads-u-margin-bottom--0">
        <a
          className="vads-c-action-link--green"
          href="/"
          aria-label={ariaLabel}
          onClick={e => handleClick(e)}
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
          >
            <va-card show-shadow={checkInableAppointments.length > 1}>
              <h4 className="vads-u-margin-top--0">{cardTitle}</h4>
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
  router: PropTypes.object,
  appointments: PropTypes.array,
};

export default WhatToDoNext;
