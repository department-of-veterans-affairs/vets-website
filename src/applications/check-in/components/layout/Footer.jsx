import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { APP_NAMES } from '../../utils/appConstants';
import { makeSelectApp } from '../../selectors';
import ExternalLink from '../ExternalLink';

const Footer = ({ header, message }) => {
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();

  return (
    <footer>
      <h2
        data-testid="heading"
        className="help-heading vads-u-font-size--lg vads-u-padding-bottom--1 vads-u-border-bottom--3px vads-u-border-color--primary"
      >
        {header ?? t('need-help')}
      </h2>
      {app === APP_NAMES.PRE_CHECK_IN ? (
        <>
          <p>
            <span className="vads-u-font-weight--bold">
              {t(
                'for-questions-about-your-appointment-or-if-you-have-a-health-related-concern',
              )}
            </span>{' '}
            {t('call-your-va-provider')}
            <br />
            <ExternalLink href="/find-locations/" hrefLang="en">
              {t('contact-your-va-provider')}
            </ExternalLink>
            .
          </p>
          <p>
            <span className="vads-u-font-weight--bold">
              {t(
                'for-questions-about-how-to-fill-out-your-pre-check-in-tasks-or-if-you-need-help-with-the-form',
              )}
            </span>{' '}
            {t('please-call-our-myva411-main-information-line-at')}{' '}
            <va-telephone contact="8006982411" />{' '}
            {t('and-select-0-were-here-24-7')}
          </p>
          <p>
            {t('if-you-have-hearing-loss-call')}{' '}
            <va-telephone contact="711">{t('tty-711')}</va-telephone>.
          </p>
        </>
      ) : (
        <p>{t('ask-a-staff-member')}</p>
      )}
      {message}
    </footer>
  );
};

Footer.propTypes = {
  header: PropTypes.string,
  message: PropTypes.node,
};

export default Footer;
