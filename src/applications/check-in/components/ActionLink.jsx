import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { APP_NAMES } from '../utils/appConstants';
import { useStorage } from '../hooks/useStorage';

const ActionLink = props => {
  const { action, appointmentId, app, startTime } = props;
  const { t } = useTranslation();
  const { getPreCheckinComplete } = useStorage(app);

  const linkText =
    app === APP_NAMES.PRE_CHECK_IN
      ? t('review-your-information-now-to-complete-pre-check-in')
      : t('check-in-now');

  let label = false;
  if (app === APP_NAMES.CHECK_IN && startTime) {
    label = t('check-in-now-for-your-date-time-appointment', {
      date: new Date(startTime),
    });
  }
  if (
    app === APP_NAMES.PRE_CHECK_IN &&
    getPreCheckinComplete(window)?.complete
  ) {
    return <></>;
  }
  return (
    <p
      className="vads-u-margin-bottom--0"
      data-testid={
        app === APP_NAMES.PRE_CHECK_IN
          ? 'review-information-button'
          : 'check-in-button'
      }
    >
      <va-link-action
        href="/"
        onClick={e => action(e, appointmentId)}
        text={linkText}
        data-testid="action-link"
        label={label}
      />
    </p>
  );
};

ActionLink.propTypes = {
  action: PropTypes.func.isRequired,
  app: PropTypes.string.isRequired,
  appointmentId: PropTypes.string.isRequired,
  startTime: PropTypes.string,
};

export default ActionLink;
