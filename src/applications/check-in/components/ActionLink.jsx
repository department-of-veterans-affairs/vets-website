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
      ? t('review-your-information-now')
      : t('check-in-now');

  const attrs = {};
  if (startTime) {
    attrs['aria-label'] = t('check-in-now-for-your-date-time-appointment', {
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
      <a
        data-testid="action-link"
        className="vads-c-action-link--green"
        href="/"
        onClick={e => action(e, appointmentId)}
        {...attrs}
      >
        {linkText}
      </a>
    </p>
  );
};

ActionLink.propTypes = {
  action: PropTypes.func.isRequired,
  app: PropTypes.string.isRequired,
  appointmentId: PropTypes.string.isRequired,
  cardTitleId: PropTypes.string,
  startTime: PropTypes.string,
};

export default ActionLink;
