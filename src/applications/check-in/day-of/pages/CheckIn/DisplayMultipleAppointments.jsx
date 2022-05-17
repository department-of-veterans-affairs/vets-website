import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { useTranslation, Trans } from 'react-i18next';
import { useGetCheckInData } from '../../../hooks/useGetCheckInData';

import AppointmentListItem from '../../../components/AppointmentDisplay/AppointmentListItem';
import BackButton from '../../../components/BackButton';
import BackToHome from '../../../components/BackToHome';
import Footer from '../../../components/Footer';
import LanguagePicker from '../../../components/LanguagePicker';
import { useFormRouting } from '../../../hooks/useFormRouting';

import { createAnalyticsSlug } from '../../../utils/analytics';
import { sortAppointmentsByStartTime } from '../../../utils/appointment';

import { makeSelectCurrentContext } from '../../../selectors';

const DisplayMultipleAppointments = props => {
  const { appointments, router, token } = props;
  const { t } = useTranslation();
  const { goToErrorPage } = useFormRouting(router);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  const { shouldRefresh } = context;

  const { isLoading, checkInDataError, refreshCheckInData } = useGetCheckInData(
    shouldRefresh,
    false,
    true,
  );

  useEffect(
    () => {
      focusElement('h1');

      if (checkInDataError) {
        goToErrorPage();
      }
    },
    [checkInDataError, goToErrorPage, refreshCheckInData],
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
  return isLoading ? (
    <va-loading-indicator message={t('loading-your-appointments-for-today')} />
  ) : (
    <>
      <BackButton router={router} action={goToPreviousPage} />
      <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 appointment-check-in">
        <LanguagePicker />
        <h1 tabIndex="-1" className="vads-u-margin-top--2">
          {t('your-appointments')}
        </h1>
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
      </div>
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
