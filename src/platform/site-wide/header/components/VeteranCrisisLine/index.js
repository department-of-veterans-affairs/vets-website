/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

export const VeteranCrisisLine = props => (
  <div className="vads-u-background-color--secondary-darkest vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center vads-u-text-align--center vads-u-padding--0p5">
    <button
      className="va-button-link vads-u-color--white vads-u-text-decoration--none va-overlay-trigger"
      data-show="#modal-crisisline"
      id={props.id}
      onClick={() => {
        recordEvent({ event: 'nav-crisis-header' });
        recordEvent({ event: 'nav-jumplink-click' });
      }}
    >
      <span>
        Talk to the <strong>Veterans Crisis Line</strong> now
      </span>
      {/* right caret icon */}
      {/* Convert to va-icon when injected header/footer split is in prod: https://github.com/department-of-veterans-affairs/vets-website/pull/27590 */}
      <svg
        aria-hidden="true"
        className="vads-u-margin-left--1"
        focusable="false"
        width="16"
        viewBox="7 1 17 17"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#fff"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"
        />
      </svg>
    </button>
  </div>
);

VeteranCrisisLine.propTypes = {
  id: PropTypes.string,
};

export default VeteranCrisisLine;
