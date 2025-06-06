import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';
import { URLS } from '../utils/navigation';

import {
  getAppointmentId,
  organizeAppointmentsByYearMonthDay,
} from '../utils/appointment';

import ListWrapper from './ListWrapper';
import UpcomingAppointmentsListItem from './UpcomingAppointmentsListItem';

const UpcomingAppointmentsList = props => {
  const { router, app, upcomingAppointments } = props;
  const { jumpToPage, getCurrentPageFromRouter } = useFormRouting(router);
  const { t } = useTranslation();
  const page = getCurrentPageFromRouter();

  const groupedAppointments = organizeAppointmentsByYearMonthDay(
    upcomingAppointments,
  );

  const handleDetailClick = (e, appointment) => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('details-link-clicked', 'nav', app),
    });
    if (page === URLS.UPCOMING_APPOINTMENTS) {
      jumpToPage(
        `upcoming-appointment-details/${getAppointmentId(appointment)}`,
      );
    } else {
      jumpToPage(`appointment-details/${getAppointmentId(appointment)}`);
    }
  };

  if (groupedAppointments.length < 1) {
    window.scrollTo(0, 0);
    return (
      <div data-testid="no-upcoming-appointments">
        <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
          {t('we-cant-find-any-upcoming-appointments')}
        </h2>
        <p>{t('our-online-check-in-tool-doesnt-include-all')}</p>
        <p>
          <va-link
            href="https://www.va.gov/health-care/schedule-view-va-appointments/"
            text={t('go-to-all-your-va-appointments')}
          />
        </p>
        <p className="vads-u-margin-bottom--0">
          <va-link
            href="https://www.va.gov/find-locations/"
            text={t('find-your-health-facilities-phone-number')}
          />
        </p>
      </div>
    );
  }
  return (
    <div
      data-testid="upcoming-appointments-list"
      className="vads-u-border-bottom--1px vads-u-border-color--gray-light"
    >
      {groupedAppointments.map(month => {
        const { firstAppointmentStartTime, days } = month;
        const monthDate = new Date(firstAppointmentStartTime);
        return (
          <div key={firstAppointmentStartTime}>
            <h2
              data-testid="appointments-list-monthyear-heading"
              className="vads-u-font-size--h3"
            >
              {t('date-month-and-year', { date: monthDate })}
            </h2>
            {days.map((day, index) => {
              const { appointments } = day;
              const dayStartTime = new Date(appointments[0].startTime);
              return (
                <div
                  className="vads-l-grid-container vads-u-padding-x--0"
                  key={index}
                >
                  <div className="vads-l-row">
                    <div className="vads-l-col--2 vads-u-border-top--1px vads-u-border-color--gray-light">
                      <h3
                        className="vads-u-text-align--center vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-top--1p5 vads-u-font-size--h4"
                        data-testid="day-label"
                      >
                        <span className="vads-u-font-size--lg vads-u-font-family--serif vads-u-font-weight--bold vads-u-line-height--3">
                          {`${t('date-day-of-month', { date: dayStartTime })} `}
                        </span>
                        <br />
                        {t('date-day-of-week', { date: dayStartTime })}
                      </h3>
                    </div>
                    <div className="vads-l-col--10 vads-u-border-top--1px vads-u-border-color--gray-light">
                      <ListWrapper
                        count={appointments.length}
                        className="vads-u-margin-bottom--3 check-in--appointment-list appointment-list"
                        testId="appointment-list"
                      >
                        {appointments.map((appointment, number) => {
                          return (
                            <UpcomingAppointmentsListItem
                              key={getAppointmentId(appointment)}
                              appointment={appointment}
                              goToDetails={handleDetailClick}
                              router={router}
                              border={number !== appointments.length - 1}
                              app={app}
                              count={appointments.length}
                            />
                          );
                        })}
                      </ListWrapper>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

UpcomingAppointmentsList.propTypes = {
  app: PropTypes.string,
  router: PropTypes.object,
  upcomingAppointments: PropTypes.array,
};

export default UpcomingAppointmentsList;
