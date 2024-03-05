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
  const { app } = useSelector(selectApp);

  const showDayOfTravelHelp = () => {
    if (travelPages.includes(currentPage)) {
      return true;
    }

    if (currentPage?.includes('complete') && app !== APP_NAMES.PRE_CHECK_IN) {
      return true;
    }

    return (
      currentPage === 'error' &&
      (error === 'check-in-post-error' || error === 'error-completing-check-in')
    );
  };

  const showTravelClaimHelp = () => {
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (app === APP_NAMES.TRAVEL_CLAIM) return true;

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
      {showDayOfTravelHelp() &&
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
      {!showDayOfTravelHelp() &&
        !showTravelClaimHelp() && (
          <div data-testid="check-in-message">
            <HelpBlock />
          </div>
        )}
      <BackToHome />
    </footer>
  );
};

Footer.propTypes = {
  router: PropTypes.object,
};

export default withRouter(Footer);
