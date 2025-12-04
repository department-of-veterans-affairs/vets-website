import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const CalendarNavigation = ({
  prevOnClick,
  nextOnClick,
  prevDisabled,
  nextDisabled,
  date,
}) => {
  return (
    <div role="rowgroup">
      <div
        className="vaos-calendar__nav vads-u-display--flex vads-u-justify-content--space-between"
        role="row"
      >
        <span role="cell">
          <va-button
            className="vaos-calendar__nav-links-button vads-u-display--flex vads-u-font-weight--normal vads-u-padding--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-color--primary"
            text="Previous"
            onClick={prevOnClick}
            disabled={prevDisabled}
            aria-label="Previous"
          />
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
          <va-button
            className="vaos-calendar__nav-links-button vads-u-display--flex vads-u-justify-content--flex-end vads-u-align-items--center vads-u-font-weight--normal vads-u-padding--0 vads-u-margin-bottom--0 vads-u-margin-top--0p5 vads-u-color--primary vads-u-margin-right--0"
            text="Next"
            onClick={nextOnClick}
            disabled={nextDisabled}
            aria-label="Next"
          />
        </span>
      </div>
    </div>
  );
};

CalendarNavigation.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  nextOnClick: PropTypes.func.isRequired,
  prevOnClick: PropTypes.func.isRequired,
  nextDisabled: PropTypes.bool,
  prevDisabled: PropTypes.bool,
};

export default CalendarNavigation;
