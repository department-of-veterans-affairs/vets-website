import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeSelectApp, makeSelectVeteranData } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';
import {
  hasPhoneAppointments,
  preCheckinAlreadyCompleted,
} from '../utils/appointment';

import WhatToDoNext from './WhatToDoNext';

const ActionItemDisplay = props => {
  const { router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const { t } = useTranslation();

  const displaySuccessAlert =
    app === APP_NAMES.PRE_CHECK_IN && preCheckinAlreadyCompleted(appointments);

  const successMessage = hasPhoneAppointments(appointments)
    ? t('your-provider-will-call-you-at-your-appointment-time')
    : t('you-can-check-in-with-your-smartphone');

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
          <WhatToDoNext router={router} appointments={appointments} />
        </section>
      )}
    </>
  );
};

ActionItemDisplay.propTypes = {
  router: PropTypes.object,
};

export default ActionItemDisplay;
