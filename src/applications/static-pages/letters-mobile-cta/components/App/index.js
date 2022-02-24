import React, { useState } from 'react';
import PropTypes from 'prop-types';

const appleStoreUrl =
  'https://apps.apple.com/us/app/va-health-and-benefits/id1559609596';
const googlePlayUrl =
  'https://play.google.com/store/apps/details?id=gov.va.mobileapp';

export const STORAGE_KEY = 'va-letters-mobile-app-message';

const createLink = (href, name) => (
  <p className="vads-u-margin-bottom--0">
    <a href={href} target="_blank" rel="noopener noreferrer">
      Get the VA: Health and Benefits app from the {name}
    </a>
  </p>
);

export const App = ({ mockUserAgent }) => {
  const [isHidden, setIsHidden] = useState(
    (sessionStorage.getItem(STORAGE_KEY) || '') !== '',
  );

  const userAgent =
    mockUserAgent || navigator.userAgent || navigator.vendor || window.opera;
  const devices = {
    ios: {
      detect: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
      link: createLink(appleStoreUrl, 'Apple App Store'),
    },
    android: {
      // https://stackoverflow.com/a/21742107
      detect: /android/i.test(userAgent),
      link: createLink(googlePlayUrl, 'Google Play store'),
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

  return isHidden ? null : (
    <va-alert
      status="info"
      closeable
      onClose={() => {
        setIsHidden(true);
        sessionStorage.setItem(STORAGE_KEY, 'hidden');
      }}
    >
      <h2 slot="headline">Download your VA letters on your mobile device</h2>
      <p>
        You can use our new mobile app to download your VA letters on your
        mobile device. To get started, download the{' '}
        <strong>VA: Health and Benefits</strong> mobile app.
      </p>
      {storeLinks}
    </va-alert>
  );
};

App.propTypes = {
  mockUserAgent: PropTypes.string,
};
