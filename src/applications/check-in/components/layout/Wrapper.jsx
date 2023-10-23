import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
  const downtimeDependency =
    app === APP_NAMES.CHECK_IN ? externalServices.cie : externalServices.pcie;
  const appTitle = app === APP_NAMES.CHECK_IN ? 'Check in' : 'Pre-check in';

  const formationSizes =
    'html { font-size: 10px; } body { font-size: 1.6rem; }';

  const uswdsSizes = 'html { font-size: 100%; } body { font-size: 16px; }';

  const [styleLibrary, setstyleLibrary] = useState('Formation');
  const [selectedFontSizes, setSelectedFontSizes] = useState(formationSizes);

  const handleChange = event => {
    const selectedValue = event.detail.value;
    setstyleLibrary(selectedValue);

    if (selectedValue === 'formation') {
      document.documentElement.style.fontSize = '10px';
      document.body.style.fontSize = '1.6rem';
      setSelectedFontSizes(formationSizes);
    } else {
      document.documentElement.style.fontSize = '100%';
      document.body.style.fontSize = '16px';
      setSelectedFontSizes(uswdsSizes);
    }
  };
  return (
    <>
      <div
        className={`vads-l-grid-container ${classNames} ${topPadding}`}
        data-testid={testID}
      >
        <div style={{ backgroundColor: `#efefef`, padding: '20px' }}>
          <VaSelect
            hint={null}
            label="Application Base Font Size Toggle"
            name="base-font-size"
            value="formation"
            onVaSelect={handleChange}
            uswds
          >
            <option value="formation">Formation</option>
            <option value="uswds">USWDS v3</option>
          </VaSelect>
          <p>
            Font size for {styleLibrary}:<br />{' '}
            <strong>{selectedFontSizes}</strong>
          </p>
        </div>

        <hr />

        <h3>USWDS v3 Component Examples</h3>

        <va-button text="Button" uswds />

        <br /><br />

        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          uswds
          visible
        >
          <h2 id="track-your-status-on-mobile" slot="headline">
            Track your claim or appeal on your mobile device
          </h2>
          <p className="vads-u-margin-y--0">
            Lorem ipsum dolor sit amet{' '}
            <a className="usa-link" href="javascript:void(0);">
              consectetur adipiscing
            </a>{' '}
            elit sed do eiusmod.
          </p>
        </va-alert>

        <hr />

        <h3>v1 Component Examples</h3>

        <va-button text="Button" />

        <br /><br />

        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <h2 id="track-your-status-on-mobile" slot="headline">
            Track your claim or appeal on your mobile device
          </h2>
          <p className="vads-u-margin-y--0">
            Lorem ipsum dolor sit amet{' '}
            <a className="usa-link" href="javascript:void(0);">
              consectetur adipiscing
            </a>{' '}
            elit sed do eiusmod.
          </p>
        </va-alert>

        <hr />

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
