import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { useFormRouting } from '../../hooks/useFormRouting';
import ExternalLink from '../ExternalLink';
import BackToHome from '../BackToHome';
import { phoneNumbers } from '../../utils/appConstants';

const Footer = ({ router, isPreCheckIn }) => {
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
      {isPreCheckIn ? (
        <div data-testid="pre-check-in-message">
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
              {t('for-questions-or-help-with-pre-check-in')}
            </span>{' '}
            {t('please-call-our-myva411-main-information-line-at')}{' '}
            <va-telephone contact={phoneNumbers.mainInfo} />{' '}
            {t('and-select-0-were-here-24-7')}
          </p>
          <p>
            {t('if-you-have-hearing-loss-call')}{' '}
            <va-telephone contact="711" tty />.
          </p>
        </div>
      ) : (
        <p data-testid="day-of-check-in-message">
          <Trans
            i18nKey="for-questions-about-your-appointment"
            components={[
              <span key="bold" className="vads-u-font-weight--bold" />,
            ]}
          />
        </p>
      )}
      {currentPage === 'introduction' && (
        <p data-testid="intro-extra-message">
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
      {currentPage &&
        currentPage.includes('complete') &&
        !isPreCheckIn && (
          <div data-testid="day-of-travel-extra-message">
            <p>
              <Trans
                i18nKey="for-questions-about-travel-reimbursement"
                components={[
                  <span key="bold" className="vads-u-font-weight--bold" />,
                ]}
              />
            </p>
            <p>
              <ExternalLink
                href="/HEALTHBENEFITS/vtp/beneficiary_travel_pocs.asp"
                hrefLang="en"
              >
                {t('find-the-travel-contact-for-your-facility')}
              </ExternalLink>
            </p>
            <p>
              <Trans
                i18nKey="or-call-our-BTSSS-toll-free-call-center"
                components={[
                  <va-telephone
                    contact={phoneNumbers.btsssCallCenter}
                    key={phoneNumbers.btsssCallCenter}
                  />,
                  <va-telephone contact="711" tty key="711" />,
                ]}
              />
            </p>
          </div>
        )}
      <BackToHome />
    </footer>
  );
};

Footer.propTypes = {
  isPreCheckIn: PropTypes.bool,
  router: PropTypes.object,
};

export default withRouter(Footer);
