import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';
import { makeSelectApp, makeSelectVeteranData } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';
import {
  hasPhoneAppointments,
  preCheckinAlreadyCompleted,
  getAppointmentId,
} from '../utils/appointment';

import WhatToDoNext from './WhatToDoNext';

const ActionItemDisplay = props => {
  const { router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { goToNextPage, jumpToPage } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const { t } = useTranslation();

  const displaySuccessAlert =
    app === APP_NAMES.PRE_CHECK_IN && preCheckinAlreadyCompleted(appointments);

  const successMessage = hasPhoneAppointments(appointments)
    ? t('your-provider-will-call-you-at-your-appointment-time')
    : t('you-can-check-in-with-your-smartphone');

  const action = e => {
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

  return (
    <>
      {displaySuccessAlert ? (
        <section data-testid="pre-check-in-success-alert">
          <va-alert
            close-btn-aria-label="Close notification"
            closeable
            status="success"
            visible
          >
            <h2 slot="headline">{t('your-information-is-up-to-date')}</h2>
            <p data-testid="success-message" className="vads-u-margin-y--0">
              {successMessage}
            </p>
          </va-alert>
        </section>
      ) : (
        <section data-testid="what-to-do-next">
          <WhatToDoNext
            router={router}
            appointments={appointments}
            goToDetails={goToDetails}
            action={action}
          />
          <button onClick={action} data-testid="action-link" type="button">
            Pass the tests
          </button>
        </section>
      )}
    </>
  );
};

ActionItemDisplay.propTypes = {
  router: PropTypes.object,
};

export default ActionItemDisplay;
