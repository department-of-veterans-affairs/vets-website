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
      Talk to the <strong>Veterans Crisis Line</strong> now
      <i
        aria-hidden="true"
        className="fa fa-chevron-right vads-u-margin-left--1"
      />
    </button>
  </div>
);

VeteranCrisisLine.propTypes = {
  id: PropTypes.string,
};

export default VeteranCrisisLine;
