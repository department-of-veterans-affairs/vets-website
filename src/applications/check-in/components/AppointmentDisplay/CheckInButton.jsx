import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { isBefore } from 'date-fns';

import { useFormRouting } from '../../hooks/useFormRouting';
import { createAnalyticsSlug } from '../../utils/analytics';

const CheckInButton = ({
  checkInWindowEnd,
  appointmentTime,
  onClick,
  eventRecorder = recordEvent,
  router,
}) => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { t } = useTranslation();
  const { getCurrentPageFromRouter } = useFormRouting(router);

  const handleClick = useCallback(
    () => {
      if (isBefore(checkInWindowEnd, new Date())) {
        const currentPage = getCurrentPageFromRouter();
        eventRecorder({
          event: createAnalyticsSlug('check-in-attempted-after-expiration'),
          fromPage: currentPage,
        });
      }

      setIsCheckingIn(true);
      onClick();
    },
    [checkInWindowEnd, eventRecorder, getCurrentPageFromRouter, onClick],
  );
  if (isCheckingIn) {
    // Creating an new button because even having disabled=false results in a SR showing the button as dimmmed.
    return (
      <va-button
        text={t('loading')}
        uswds
        data-testid="check-in-button-loading"
        disabled
        class="vads-u-display--flex"
        role="status"
      />
    );
  }
  return (
    <va-button
      text={t('check-in-now')}
      uswds
      big
      onClick={handleClick}
      data-testid="check-in-button"
      class="vads-u-display--flex"
      aria-label={
        appointmentTime
          ? t('check-in-now-for-your-time-appointment', {
              time: appointmentTime,
            })
          : t('check-in-now-for-your-appointment')
      }
    />
  );
};

CheckInButton.propTypes = {
  appointmentTime: PropTypes.instanceOf(Date),
  checkInWindowEnd: PropTypes.instanceOf(Date),
  eventRecorder: PropTypes.object,
  router: PropTypes.object,
  onClick: PropTypes.func,
};

export { CheckInButton };
