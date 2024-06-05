import React from 'react';
import PropTypes from 'prop-types';

const VeteranCrisisLine = ({ isMobile }) => {
  return (
    <div className="va-crisis-line-container vads-u-background-color--secondary-darkest">
      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
      <button
        data-testid="veteran-crisis-line-button"
        className="va-crisis-line va-overlay-trigger vads-u-background-color--secondary-darkest"
        data-show="#modal-crisisline"
        type="button"
      >
        <div className="va-crisis-line-inner">
          {!isMobile && (
            <span className="va-crisis-line-icon" aria-hidden="true" />
          )}
          <span
            data-testid="veteran-crisis-line-text"
            className="va-crisis-line-text"
          >
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

VeteranCrisisLine.propTypes = {
  isMobile: PropTypes.bool,
};

export default VeteranCrisisLine;
