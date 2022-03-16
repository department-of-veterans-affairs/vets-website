import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { useTranslation } from 'react-i18next';

import AppointmentListItem from '../../../components/AppointmentDisplay/AppointmentListItem';
import BackButton from '../../../components/BackButton';
import BackToHome from '../../../components/BackToHome';
import LanguagePicker from '../../../components/LanguagePicker';
import Footer from '../../../components/Footer';
import { useFormRouting } from '../../../hooks/useFormRouting';

import { createAnalyticsSlug } from '../../../utils/analytics';
import { sortAppointmentsByStartTime } from '../../../utils/appointment';

const DisplayMultipleAppointments = props => {
  const { appointments, getMultipleAppointments, router, token } = props;
  const { t } = useTranslation();

  useEffect(() => {
    focusElement('h1');
  }, []);

  const handleClick = useCallback(() => {
    recordEvent({
      event: createAnalyticsSlug('refresh-appointments-button-clicked'),
    });

    getMultipleAppointments();
    focusElement('h1');
  }, [getMultipleAppointments]);
  const { goToPreviousPage } = useFormRouting(router);

  const sortedAppointments = sortAppointmentsByStartTime(appointments);
  const today = format(new Date(), 'MMMM dd, yyyy');
  return (
    <>
      <BackButton router={router} action={goToPreviousPage} />
      <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 appointment-check-in">
        <h1 tabIndex="-1" className="vads-u-margin-top--2">
          {t('your-appointments')}
        </h1>
        <p data-testid="date-text">
          {t('here-are-your-appointments-for-today')}: {today}
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
          <strong>{t('latest-update')}:</strong>{' '}
          {format(new Date(), 'MMMM d, yyyy')} at{' '}
          {format(new Date(), 'h:mm aaaa')}
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
        <LanguagePicker />
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
