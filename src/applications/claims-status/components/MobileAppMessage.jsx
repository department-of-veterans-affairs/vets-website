import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const appleStoreUrl =
  'https://apps.apple.com/app/apple-store/id1559609596?pt=545860&ct=gov.va.claimstatus&mt=8';
const googlePlayUrl =
  'https://play.google.com/store/apps/details?id=gov.va.mobileapp&referrer=utm_source%3Dgov.va.claimstatus%26utm_medium%3Dbanner';

export const STORAGE_KEY = 'cst-mobile-app-message';

const createLink = (href, name) => (
  <p className="vads-u-margin-bottom--0">
    <a href={href} target="_blank" rel="noopener noreferrer">
      Download the app from {name}
    </a>
  </p>
);

export default function MobileAppMessage({ mockUserAgent }) {
  const [isHidden, setIsHidden] = useState(
    (sessionStorage.getItem(STORAGE_KEY) || '') !== '',
  );

  const userAgent =
    mockUserAgent || navigator.userAgent || navigator.vendor || window.opera;
  const devices = {
    ios: {
      detect: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
      link: createLink(appleStoreUrl, 'the App Store'),
    },
    android: {
      // https://stackoverflow.com/a/21742107
      detect: /android/i.test(userAgent),
      link: createLink(googlePlayUrl, 'Google Play'),
    },
  };

  const detectedDevice = Object.keys(devices).filter(os => devices[os].detect);
  const storeLinks =
    detectedDevice.length !== 0 ? (
      devices[detectedDevice].link
    ) : (
      <>
        {devices.ios.link}
        {devices.android.link}
      </>
    );

  const handlers = {
    closeModal: () => {
      setIsHidden(true);
      sessionStorage.setItem(STORAGE_KEY, 'hidden');
    },
  };

  return isHidden ? null : (
    <VaAlert
      class="vads-u-margin-top--2"
      closeable
      onCloseEvent={handlers.closeModal}
    >
      <h2 id="track-your-status-on-mobile" slot="headline">
        Track your claim, decision review, or appeal on your mobile device
      </h2>
      <p>
        You can use our new mobile app to check the status of your claims,
        decision reviews, or appeals on your mobile device. Download the{' '}
        <strong>VA: Health and Benefits</strong> mobile app to get started.
      </p>
      {storeLinks}
    </VaAlert>
  );
}

MobileAppMessage.propTypes = {
  mockUserAgent: PropTypes.string,
};
