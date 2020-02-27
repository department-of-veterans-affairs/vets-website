import React from 'react';
import PropTypes from 'prop-types';

const CalendarNavigation = ({
  prevOnClick,
  nextOnClick,
  prevDisabled,
  nextDisabled,
}) => (
  <div className="vaos-calendar__nav-links vads-u-display--flex vads-u-justify-content--space-between">
    <button
      className="vaos-calendar__nav-links-button vads-u-display--flex vads-u-font-weight--normal vads-u-padding--0 vads-u-color--link-default"
      onClick={prevOnClick}
      disabled={prevDisabled}
      type="button"
    >
      <i className="fas fa-chevron-left vads-u-margin-right--0p5" />
      Previous
    </button>
    <button
      className="vaos-calendar__nav-links-button vads-u-display--flex vads-u-justify-content--flex-end vads-u-font-weight--normal vads-u-padding--0 vads-u-color--link-default"
      onClick={nextOnClick}
      disabled={nextDisabled}
      type="button"
    >
      Next
      <i className="fas fa-chevron-right vads-u-margin-left--0p5" />
    </button>
  </div>
);

CalendarNavigation.propTypes = {
  prevOnClick: PropTypes.func.isRequired,
  nextOnClick: PropTypes.func.isRequired,
  prevDisabled: PropTypes.bool,
  nextDisabled: PropTypes.bool,
};

export default CalendarNavigation;
