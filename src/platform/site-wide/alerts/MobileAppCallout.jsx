import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 * @param {
 *  appleAppStoreLinkText: string -- text for apple app store link text
 *  bodyText: string | element -- text for the body of the component
 *  googlePlayStoreLinkText: string -- text for google play store link text
 *  headingText: string -- text for heading
 * } param0
 * @returns
 */
const MobileAppCallout = ({
  appleAppStoreLinkText = 'Go to the VA: Health and Benefits app on the Apple App Store',
  bodyText = 'Download the VA: Health and Benefits mobile app',
  googlePlayStoreLinkText = 'Go to the VA: Health and Benefits app on the Google Play store',
  headingText = 'Download the VA mobile app.',
}) => {
  return (
    <div id="mobile-app-callout">
      <va-alert uswds close-btn-aria-label="Close notification" status="info">
        <h3
          className="vads-u-font-size--h4"
          id="track-your-status-on-mobile"
          slot="headline"
        >
          {headingText}
        </h3>
        <div>
          <p className="vads-u-margin-y--0">{bodyText}</p>
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
                  {appleAppStoreLinkText}
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
                  {googlePlayStoreLinkText}
                </span>
              </a>
            </p>
          </div>
        </div>
      </va-alert>
    </div>
  );
};
MobileAppCallout.propTypes = {
  appleAppStoreLinkText: PropTypes.string,
  bodyText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  googlePlayStoreLinkText: PropTypes.string,
  headingText: PropTypes.string,
};

export default MobileAppCallout;
