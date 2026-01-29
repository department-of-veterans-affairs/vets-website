/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { format } from 'date-fns';

const CalendarNavigation = ({
  prevOnClick,
  nextOnClick,
  prevDisabled,
  nextDisabled,
  date,
}) => (
  <div role="rowgroup">
    <div
      className="vaos-calendar__nav vads-u-display--flex vads-u-justify-content--space-between"
      role="row"
    >
      <span role="cell">
        <button
          className="vaos-calendar__nav-links-button vads-u-display--flex vads-u-font-weight--normal vads-u-padding--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-color--primary"
          onClick={prevOnClick}
          disabled={prevDisabled}
          type="button"
          aria-label="Previous"
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
          <span className="vads-u-display--none mobile-lg:vads-u-display--inline vads-u-padding-left--1">
            Previous
          </span>
        </button>
      </span>

      <span role="cell">
        <h2
          id={`h2-${format(date, 'yyyy-MM')}`}
          className="vads-u-font-size--h4 mobile-lg:vads-u-font-size--h3 vads-u-margin-top--0p5 vads-u-font-weight--bold vads-u-text-align--center vads-u-align-items--center vads-u-margin-bottom--0 vads-u-display--block vads-u-font-family--serif"
        >
          {format(date, 'MMMM yyyy')}
        </h2>
      </span>

      <span role="cell">
        <button
          className="vaos-calendar__nav-links-button vads-u-display--flex vads-u-justify-content--flex-end vads-u-align-items--center vads-u-font-weight--normal vads-u-padding--0 vads-u-margin-bottom--0 vads-u-margin-top--0p5  vads-u-color--primary vads-u-margin-right--0"
          onClick={nextOnClick}
          disabled={nextDisabled}
          type="button"
          aria-label="Next"
        >
          <span className="vads-u-display--none mobile-lg:vads-u-display--inline vads-u-padding-right--1">
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
      </span>
    </div>
  </div>
);

CalendarNavigation.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  nextOnClick: PropTypes.func.isRequired,
  prevOnClick: PropTypes.func.isRequired,
  nextDisabled: PropTypes.bool,
  prevDisabled: PropTypes.bool,
};

export default CalendarNavigation;
