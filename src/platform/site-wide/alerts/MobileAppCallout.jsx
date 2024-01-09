import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const MobileAppCallout = () => {
  return (
    <div id="mobile-app-callout">
      <VaAlert close-btn-aria-label="Close notification" status="info">
        <h2 id="track-your-status-on-mobile" slot="headline">
          Access your Veteran status on your mobile device.
        </h2>
        <div>
          <p className="vads-u-margin-y--0">
            You can use our new mobile app to view and show your status with
            retailers and other service providers. Download the VA: Health and
            Benefits mobile app to get started.
          </p>
          <div className="vads-u-font-size--lg">
            <p>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://apps.apple.com/us/app/va-health-and-benefits/id1559609596"
              >
                <i
                  className="fab fa-app-store-ios fa-lg vads-u-margin--1"
                  aria-hidden="true"
                />
                <span className="vads-u-font-size--md">
                  Download the app from the App Store
                </span>
              </a>
            </p>
            <p>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US&gl=US&pli=1"
              >
                <i
                  className="fab fa-google-play fa-lg vads-u-margin--1"
                  aria-hidden="true"
                />
                <span className="vads-u-font-size--md">
                  Download the app from Google Play
                </span>
              </a>
            </p>
          </div>
        </div>
      </VaAlert>
    </div>
  );
};

export default MobileAppCallout;
