import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import { makeSelectApp } from '../../selectors';
import { APP_NAMES } from '../../utils/appConstants';
import { useDatadogRum } from '../../hooks/useDatadogRum';
import MixedLanguageDisclaimer from '../MixedLanguageDisclaimer';
import LanguagePicker from '../LanguagePicker';
import Footer from './Footer';

const Wrapper = props => {
  const {
    children,
    pageTitle,
    eyebrow,
    classNames = '',
    withBackButton = false,
    testID,
  } = props;
  useEffect(() => {
    focusElement('h1');
  }, []);

  useDatadogRum();

  const topPadding = withBackButton
    ? 'vads-u-padding-y--2'
    : ' vads-u-padding-y--3';

  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  // @TODO we need to add a pagerduty switch and external serivce for travel-claim app
  let downtimeDependency;
  let appTitle;
  switch (app) {
    case APP_NAMES.CHECK_IN:
      appTitle = 'check in';
      downtimeDependency = externalServices.cie;
      break;
    case APP_NAMES.PRE_CHECK_IN:
      appTitle = 'pre-check in';
      downtimeDependency = externalServices.pcie;
      break;
    case APP_NAMES.TRAVEL_CLAIM:
      appTitle = 'travel claim';
      break;
    default:
      appTitle = 'appointments';
      break;
  }
  return (
    <>
      <div
        className={`vads-l-grid-container ${classNames} ${topPadding}`}
        data-testid={testID}
      >
        <MixedLanguageDisclaimer />
        <LanguagePicker withTopMargin={!withBackButton} />
        {pageTitle && (
          <h1 tabIndex="-1" data-testid="header">
            {eyebrow && (
              <span className="check-in-eyebrow vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
                {`${eyebrow} `}
              </span>
            )}
            {pageTitle}
          </h1>
        )}
        <DowntimeNotification
          appTitle={appTitle}
          dependencies={[downtimeDependency]}
        >
          {children}
        </DowntimeNotification>
        <Footer isPreCheckIn={app === APP_NAMES.PRE_CHECK_IN} />
      </div>
    </>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node,
  classNames: PropTypes.string,
  eyebrow: PropTypes.string,
  pageTitle: PropTypes.string,
  testID: PropTypes.string,
  withBackButton: PropTypes.bool,
};

export default Wrapper;
