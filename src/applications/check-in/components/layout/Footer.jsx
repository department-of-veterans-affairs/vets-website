import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { APP_NAMES } from '../../utils/appConstants';
import { useFormRouting } from '../../hooks/useFormRouting';
import BackToHome from '../BackToHome';
import HelpBlock from '../HelpBlock';
import { makeSelectError, makeSelectApp } from '../../selectors';

const Footer = ({ router }) => {
  const { t } = useTranslation();
  const { getCurrentPageFromRouter } = useFormRouting(router);
  const selectError = useMemo(makeSelectError, []);
  const { error } = useSelector(selectError);
  const currentPage = getCurrentPageFromRouter();

  const travelPages = [
    'travel-pay',
    'travel-address',
    'travel-vehicle',
    'travel-mileage',
    'travel-review',
  ];

  const selectApp = useMemo(makeSelectApp, []);
  const { appName } = useSelector(selectApp);

  const showTravelHelp = () => {
    if (travelPages.includes(currentPage)) {
      return true;
    }

    if (
      currentPage?.includes('complete') &&
      appName !== APP_NAMES.PRE_CHECK_IN
    ) {
      return true;
    }

    return (
      currentPage === 'error' &&
      (error === 'check-in-post-error' || error === 'error-completing-check-in')
    );
  };

  const showTravelClaimHelp = () => {
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (appName === APP_NAMES.TRAVEL_CLAIM) return true;

    return false;
  };

  return (
    <footer>
      <h2
        data-testid="heading"
        className="vads-u-font-size--lg vads-u-padding-bottom--1 vads-u-border-bottom--3px vads-u-border-color--primary"
      >
        {t('need-help')}
      </h2>
      {showTravelHelp() &&
        !showTravelClaimHelp() && (
          <div data-testid="check-in-message">
            <HelpBlock dayOfTravel />
          </div>
        )}
      {showTravelClaimHelp() && (
        <div data-testid="check-in-message">
          <HelpBlock travelClaim />
        </div>
      )}
      {!showTravelHelp() &&
        !showTravelClaimHelp() && (
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
  router: PropTypes.object,
};

export default withRouter(Footer);
