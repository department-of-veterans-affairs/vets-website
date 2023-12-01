import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { APP_NAMES } from '../utils/appConstants';

const ActionLink = props => {
  const { action, appointmentId, app, cardTitleId, startTime } = props;
  const { t } = useTranslation();

  const linkText =
    app === APP_NAMES.PRE_CHECK_IN
      ? t('review-your-information-now')
      : t('check-in-now');

  const attrs = {};
  if (app === APP_NAMES.PRE_CHECK_IN) {
    attrs['aria-labelledby'] = cardTitleId;
  } else {
    attrs['aria-label'] = t('check-in-now-for-your-date-time-appointment', {
      date: new Date(startTime),
    });
  }

  return (
    <p className="vads-u-margin-bottom--0">
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
  cardTitleId: PropTypes.string.isRequired,
  startTime: PropTypes.string,
};

export default ActionLink;
