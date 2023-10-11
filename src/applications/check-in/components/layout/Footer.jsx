import React from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { useFormRouting } from '../../hooks/useFormRouting';
import BackToHome from '../BackToHome';
import HelpBlock from '../HelpBlock';

const Footer = ({ router, isPreCheckIn }) => {
  const { t } = useTranslation();
  const { getCurrentPageFromRouter } = useFormRouting(router);

  const currentPage = getCurrentPageFromRouter();

  const travelPages = [
    'travel-pay',
    'travel-address',
    'travel-vehicle',
    'travel-mileage',
  ];
  return (
    <footer>
      <h2
        data-testid="heading"
        className="vads-u-font-size--lg vads-u-padding-bottom--1 vads-u-border-bottom--3px vads-u-border-color--primary"
      >
        {t('need-help')}
      </h2>
      {travelPages.includes(currentPage) ||
      (currentPage && currentPage.includes('complete') && !isPreCheckIn) ? (
        <div data-testid="check-in-message">
          <HelpBlock travel />
        </div>
      ) : (
        <div data-testid="check-in-message">
          <HelpBlock />
        </div>
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
      <BackToHome />
    </footer>
  );
};

Footer.propTypes = {
  isPreCheckIn: PropTypes.bool,
  router: PropTypes.object,
};

export default withRouter(Footer);
