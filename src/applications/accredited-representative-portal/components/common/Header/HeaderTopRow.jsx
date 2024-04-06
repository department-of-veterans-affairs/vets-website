import React from 'react';

import USAWebsiteHeader from './USAWebsiteHeader';

const HeaderTopRow = () => {
  return (
    <div className="va-notice--banner">
      <div className="va-notice--banner-inner">
        <USAWebsiteHeader />
      </div>
      <div className="va-crisis-line-container vads-u-background-color--secondary-darkest">
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
        <button
          className="va-crisis-line va-overlay-trigger vads-u-background-color--secondary-darkest"
          data-show="#modal-crisisline"
          onClick="recordEvent({ event: 'nav-crisis-header' })"
          type="button"
        >
          <div className="va-crisis-line-inner">
            <span className="va-crisis-line-icon" aria-hidden="true" />
            <span className="va-crisis-line-text">
              Talk to the <strong>Veterans Crisis Line</strong> now
            </span>
            <img
              alt=""
              aria-hidden="true"
              className="va-crisis-line-arrow"
              src="/img/arrow-right-white.svg"
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default HeaderTopRow;
