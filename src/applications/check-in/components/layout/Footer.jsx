import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { APP_NAMES } from '../../utils/appConstants';
import { useFormRouting } from '../../hooks/useFormRouting';
import { makeSelectApp } from '../../selectors';
import ExternalLink from '../ExternalLink';
import BackToHome from '../BackToHome';

const Footer = ({ router }) => {
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { getCurrentPageFromRouter } = useFormRouting(router);

  const currentPage = getCurrentPageFromRouter();
  return (
    <footer>
      <h2
        data-testid="heading"
        className="vads-u-font-size--lg vads-u-padding-bottom--1 vads-u-border-bottom--3px vads-u-border-color--primary"
      >
        {t('need-help')}
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
            {/* Not using the va-telephone component due to issues with 711 link. To re-evaluate after component is fixed. */}
            <va-telephone contact="711" />
          </p>
        </>
      ) : (
        <p>{t('ask-a-staff-member')}</p>
      )}
      {currentPage === 'introduction' && (
        <p>
          <span className="vads-u-font-weight--bold">
            {t(
              'if-you-need-to-talk-to-someone-right-away-or-need-emergency-care',
            )}
          </span>{' '}
          call <va-telephone contact="911" />,{' '}
          <span className="vads-u-font-weight--bold">or</span>{' '}
          {t('call-the-veterans-crisis-hotline-at')}{' '}
          <va-telephone contact="988" /> {t('and-select-1')}
        </p>
      )}
      <BackToHome />
    </footer>
  );
};

Footer.propTypes = {
  router: PropTypes.object,
};

export default withRouter(Footer);
