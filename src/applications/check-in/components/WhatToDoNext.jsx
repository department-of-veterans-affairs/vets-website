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
import { useUpdateError } from '../hooks/useUpdateError';
import { useStorage } from '../hooks/useStorage';

const WhatToDoNext = props => {
  const { router, appointments, action, goToDetails } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const { getCheckinComplete, getPreCheckinComplete } = useStorage(app);

  const sortedAppointments = sortAppointmentsByStartTime(appointments);
  let actionableAppointments = sortedAppointments;
  if (app === APP_NAMES.CHECK_IN) {
    actionableAppointments = getCheckinableAppointments(sortedAppointments);
  }
  const complete =
    app === APP_NAMES.CHECK_IN
      ? getCheckinComplete(window)
      : getPreCheckinComplete(window);

  if (!actionableAppointments.length && !complete) {
    updateError(
      app === APP_NAMES.CHECK_IN
        ? 'check-in-past-appointment'
        : 'pre-check-in-expired',
    );
  }
  const appointmentCards =
    app === APP_NAMES.PRE_CHECK_IN
      ? [actionableAppointments[0]]
      : actionableAppointments;

  const getPreCheckinCardTitle = () => {
    let title = `${t('review-your-contact-information-for-your')} `;
    if (actionableAppointments.length > 1) {
      actionableAppointments.forEach((appointment, index) => {
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

  const showDetailsLink =
    (actionableAppointments.length === 1 && app === APP_NAMES.PRE_CHECK_IN) ||
    app === APP_NAMES.CHECK_IN;

  return (
    <>
      {appointmentCards.length ? (
        <>
          <h2 data-testid="what-next-header">{t('what-to-do-next')}</h2>
          <div data-testid="appointments">
            {appointmentCards.map((appointment, index) => {
              const cardTitleId = `what-next-card-title-${index}`;
              let cardTitle = t(
                'its-time-to-check-in-for-your-time-appointment',
                {
                  time: new Date(appointment.startTime),
                },
              );
              if (app === APP_NAMES.PRE_CHECK_IN) {
                cardTitle = getPreCheckinCardTitle();
              }
              return (
                <div
                  className="vads-u-margin-bottom--2"
                  key={appointment.appointmentIen}
                  data-testid="what-next-card"
                >
                  <va-card show-shadow={actionableAppointments.length > 1}>
                    <h3
                      className="vads-u-margin-top--0 vads-u-font-size--h4"
                      data-testid="what-next-card-title"
                      id={cardTitleId}
                    >
                      {cardTitle}
                    </h3>
                    {showDetailsLink && (
                      <p>
                        <a
                          data-testid={`details-link-${index}`}
                          href={`${
                            router.location.basename
                          }/appointment-details/${getAppointmentId(
                            appointment,
                          )}`}
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
                    )}
                    <ActionLink
                      app={app}
                      action={action}
                      startTime={appointment.startTime}
                      appointmentId={getAppointmentId(appointment)}
                    />
                  </va-card>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        ''
      )}
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
