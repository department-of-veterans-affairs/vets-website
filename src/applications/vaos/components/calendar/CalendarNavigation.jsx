import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const CalendarNavigation = ({
  prevOnClick,
  nextOnClick,
  prevDisabled,
  nextDisabled,
  momentMonth,
}) => (
  <div className="vaos-calendar__nav vads-u-display--flex vads-u-justify-content--space-between">
    <button
      className="vaos-calendar__nav-links-button vads-u-display--flex vads-u-font-weight--normal vads-u-padding--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-color--primary"
      onClick={prevOnClick}
      disabled={prevDisabled}
      type="button"
    >
      <span
        className={classNames(
          `vaos-calendar__nav-link-icon`,
          `${
            prevDisabled
              ? 'vads-u-background-color--gray-light'
              : 'vads-u-background-color--primary'
          }`,
        )}
      >
        <va-icon icon="navigate_before" size="3" aria-hidden="true" />
      </span>
      <span className="vads-u-display--none small-screen:vads-u-display--inline vads-u-padding-left--1">
        Previous
      </span>
    </button>

    <h2
      id={`h2-${momentMonth.format('YYYY-MM')}`}
      className="vads-u-font-size--h4 small-screen:vads-u-font-size--h3 vads-u-margin-top--0p5 vads-u-font-weight--bold vads-u-text-align--center vads-u-align-items--center vads-u-margin-bottom--0 vads-u-display--block vads-u-font-family--serif"
    >
      {momentMonth.format('MMMM YYYY')}
    </h2>
    <button
      className="vaos-calendar__nav-links-button vads-u-display--flex vads-u-justify-content--flex-end vads-u-align-items--center vads-u-font-weight--normal vads-u-padding--0 vads-u-margin-bottom--0 vads-u-margin-top--0p5  vads-u-color--primary vads-u-margin-right--0"
      onClick={nextOnClick}
      disabled={nextDisabled}
      type="button"
    >
      <span className="vads-u-display--none small-screen:vads-u-display--inline vads-u-padding-right--1">
        Next
      </span>
      <span
        className={classNames(
          `vaos-calendar__nav-link-icon`,
          `${
            nextDisabled
              ? 'vads-u-background-color--gray-light'
              : 'vads-u-background-color--primary'
          }`,
        )}
      >
        <va-icon icon="navigate_next" size="3" aria-hidden="true" />
      </span>
    </button>
    <div
      className="sr-only"
      id={`vaos-calendar-instructions-${momentMonth.month()}`}
    >
      Press the Enter key to expand the day you want to schedule an appointment.
      Then press the Tab key or form shortcut key to select an appointment time.
    </div>
  </div>
);

CalendarNavigation.propTypes = {
  prevOnClick: PropTypes.func.isRequired,
  nextOnClick: PropTypes.func.isRequired,
  prevDisabled: PropTypes.bool,
  nextDisabled: PropTypes.bool,
};

export default CalendarNavigation;
