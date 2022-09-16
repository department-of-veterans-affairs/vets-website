import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import { makeSelectApp } from '../../selectors';
import MixedLanguageDisclaimer from '../MixedLanguageDisclaimer';
import LanguagePicker from '../LanguagePicker';
import Footer from './Footer';

const Wrapper = props => {
  const {
    children,
    pageTitle,
    classNames = '',
    withBackButton = false,
    testID,
  } = props;
  useEffect(() => {
    focusElement('h1');
  }, []);

  const topPadding = withBackButton
    ? 'vads-u-padding-y--2'
    : ' vads-u-padding-y--3';

  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const downtimeDependency =
    app === 'dayOf' ? externalServices.cie : externalServices.pcie;
  const appTitle = app === 'dayOf' ? 'Check in' : 'Pre-check in';
  return (
    <>
      <div
        className={`vads-l-grid-container ${classNames} ${topPadding}`}
        data-testid={testID}
      >
        <MixedLanguageDisclaimer />
        <LanguagePicker withTopMargin={!withBackButton} />
        <h1 tabIndex="-1" data-testid="header">
          {pageTitle}
        </h1>
        <DowntimeNotification
          appTitle={appTitle}
          dependencies={[downtimeDependency]}
        >
          {children}
        </DowntimeNotification>
        <Footer />
      </div>
    </>
  );
};

Wrapper.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
  classNames: PropTypes.string,
  testID: PropTypes.string,
  withBackButton: PropTypes.bool,
};

export default Wrapper;
