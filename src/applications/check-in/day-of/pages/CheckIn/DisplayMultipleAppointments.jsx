import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { useTranslation, Trans } from 'react-i18next';
import { useGetCheckInData } from '../../../hooks/useGetCheckInData';

import AppointmentListItem from '../../../components/AppointmentDisplay/AppointmentListItem';
import BackButton from '../../../components/BackButton';
import BackToHome from '../../../components/BackToHome';
import Footer from '../../../components/layout/Footer';
import { useFormRouting } from '../../../hooks/useFormRouting';

import { createAnalyticsSlug } from '../../../utils/analytics';
import {
  intervalUntilNextAppointmentIneligibleForCheckin,
  sortAppointmentsByStartTime,
} from '../../../utils/appointment';

import { makeSelectCurrentContext } from '../../../selectors';
import Wrapper from '../../../components/layout/Wrapper';

const DisplayMultipleAppointments = props => {
  const { appointments, router, token } = props;
  const { t } = useTranslation();
  const { goToErrorPage } = useFormRouting(router);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  const { shouldRefresh } = context;

  const { isLoading, checkInDataError, refreshCheckInData } = useGetCheckInData(
    shouldRefresh,
    true,
  );

  const refreshTimer = useRef(null);

  useEffect(
    () => {
      const refreshInterval = intervalUntilNextAppointmentIneligibleForCheckin(
        appointments,
      );

      // Refresh the page 5 seconds before the checkIn window expires.
      if (refreshInterval > 5000) {
        if (refreshTimer.current !== null) {
          clearTimeout(refreshTimer.current);
        }

        refreshTimer.current = setTimeout(
          () => refreshCheckInData(),
          refreshInterval - 5000,
        );
      }

      if (checkInDataError) {
        goToErrorPage();
      }
    },
    [appointments, checkInDataError, goToErrorPage, refreshCheckInData],
  );

  const handleClick = useCallback(
    () => {
      recordEvent({
        event: createAnalyticsSlug('refresh-appointments-button-clicked'),
      });

      refreshCheckInData();
      focusElement('h1');
    },
    [refreshCheckInData],
  );

  const { goToPreviousPage } = useFormRouting(router);

  const sortedAppointments = sortAppointmentsByStartTime(appointments);

  if (isLoading) window.scrollTo(0, 0);

  return isLoading ? (
    <va-loading-indicator message={t('loading-your-appointments-for-today')} />
  ) : (
    <>
      <BackButton router={router} action={goToPreviousPage} />
      <Wrapper
        pageTitle={t('your-appointments')}
        classNames="appointment-check-in"
        withBackButton
      >
        <p data-testid="date-text">
          {t('here-are-your-appointments-for-today', { date: new Date() })}
        </p>
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ol
          className="appointment-list vads-u-padding--0 vads-u-margin--0 vads-u-margin-bottom--2"
          role="list"
        >
          {sortedAppointments.map((appointment, index) => {
            return (
              <AppointmentListItem
                appointment={appointment}
                key={index}
                router={router}
                token={token}
              />
            );
          })}
        </ol>
        <p data-testid="update-text">
          <Trans
            i18nKey="latest-update"
            components={{ bold: <strong /> }}
            values={{ date: new Date() }}
          />
        </p>
        <p data-testid="refresh-link">
          <button
            className="usa-button-secondary"
            onClick={handleClick}
            data-testid="refresh-appointments-button"
            type="button"
          >
            {t('refresh')}
          </button>
        </p>
        <Footer />
        <BackToHome />
      </Wrapper>
    </>
  );
};

DisplayMultipleAppointments.propTypes = {
  appointments: PropTypes.array,
  getMultipleAppointments: PropTypes.func,
  router: PropTypes.object,
  token: PropTypes.string,
};

export default DisplayMultipleAppointments;
