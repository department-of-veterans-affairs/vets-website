import React, { useState } from 'react';
import environment from 'platform/utilities/environment';

const appleStoreUrl =
  'https://apps.apple.com/app/apple-store/id1559609596?pt=545860&ct=gov.va.claimstatus&mt=8';
const googlePlayUrl =
  'https://play.google.com/store/apps/details?id=gov.va.mobileapp&referrer=utm_source%3Dgov.va.claimstatus%26utm_medium%3Dbanner';

export const STORAGE_KEY = 'cst-mobile-app-message';

const createLink = (href, name, label) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`download the VA health and benefits app from ${label || name}`}
  >
    {name}
  </a>
);

export default function MobileAppMessage({ mockUserAgent }) {
  const [isHidden, setIsHidden] = useState(
    (sessionStorage.getItem(STORAGE_KEY) || '') !== '',
  );

  // Hide in production until content review is complete
  if (environment.isProduction()) {
    return null;
  }

  const userAgent =
    mockUserAgent || navigator.userAgent || navigator.vendor || window.opera;
  const devices = {
    ios: {
      detect: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
      link: <>the {createLink(appleStoreUrl, 'App Store', 'the app store')}</>,
    },
    android: {
      // https://stackoverflow.com/a/21742107
      detect: /android/i.test(userAgent),
      link: createLink(googlePlayUrl, 'Google Play'),
    },
  };

  const detectedDevice = Object.keys(devices).filter(os => devices[os].detect);
  const storeLinks =
    detectedDevice.length !== 0
      ? devices[detectedDevice].link
      : [devices.ios.link, ' or on ', devices.android.link];

  return isHidden ? null : (
    <va-alert
      status="info"
      closeable
      onClose={() => {
        setIsHidden(true);
        sessionStorage.setItem(STORAGE_KEY, 'hidden');
      }}
    >
      <h2 slot="headline">Check your status with our new mobile app</h2>
      <p>
        Get updates on your claims or appeals right at your fingertips using our
        new mobile app. Download it on {storeLinks}.
      </p>
    </va-alert>
  );
}
