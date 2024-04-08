import React from 'react';

const VeteranCrisisLine = ({ isMobile }) => {
  return (
    <div className="va-crisis-line-container vads-u-background-color--secondary-darkest">
      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
      <button
        className="va-crisis-line va-overlay-trigger vads-u-background-color--secondary-darkest"
        id="header-crisis-line"
        data-show="#modal-crisisline"
        type="button"
      >
        <div className="va-crisis-line-inner">
          {!isMobile && (
            <span className="va-crisis-line-icon" aria-hidden="true" />
          )}
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
  );
};

export default VeteranCrisisLine;
