import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ReactTitle } from 'react-meta-tags';
import { useTranslation } from 'react-i18next';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import { makeSelectApp } from '../../selectors';
import { APP_NAMES } from '../../utils/appConstants';
import { toCamelCase } from '../../utils/formatters';
import { useDatadogRum } from '../../hooks/useDatadogRum';
import MixedLanguageDisclaimer from '../MixedLanguageDisclaimer';
import LanguagePicker from '../LanguagePicker';
import Footer from './Footer';

const Wrapper = props => {
  const {
    children,
    pageTitle,
    titleOverride,
    eyebrow,
    classNames = '',
    withBackButton = false,
    testID,
  } = props;
  useEffect(() => {
    focusElement('h1');
  }, []);

  useDatadogRum();
  const { t } = useTranslation();
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
      downtimeDependency = externalServices.tc;
      break;
    default:
      appTitle = 'appointments';
      break;
  }
  let metaTitle = pageTitle ?? appTitle;

  if (titleOverride) {
    metaTitle = titleOverride;
  }
  return (
    <>
      <div
        className={`vads-l-grid-container ${classNames} ${topPadding}`}
        data-testid={testID}
      >
        <ReactTitle title={`${metaTitle} | ${t('veterans-affairs')}`} />
        <MixedLanguageDisclaimer />
        <LanguagePicker />
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
          customText={{ appType: 'tool' }}
        >
          {/* Seems like the only way to unit test this ¯\_(ツ)_/¯ */}
          <div data-testid={toCamelCase(metaTitle)}>{children}</div>
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
  titleOverride: PropTypes.string,
  withBackButton: PropTypes.bool,
};

export default Wrapper;
