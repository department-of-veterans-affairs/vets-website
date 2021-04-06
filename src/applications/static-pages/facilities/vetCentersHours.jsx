import React from 'react';
import PropTypes from 'prop-types';
import { formatHours } from '../../facility-locator/utils/formatHours';

const VetCenterHours = props => {
  if (props.hours.length === 0) return null;

  const arrayOfWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const buildHours = hours => {
    const hoursListItems = [...hours.slice(-6), hours[0]].map(hourObj => {
      // {day: 4, starthours: 700, endhours: 1730, comment: ""}
      let hourLabel;
      if (hourObj.starthours < 0 || hourObj.endhours < 0) {
        hourLabel = `${arrayOfWeekdays[hourObj.day]}: ${hourObj.comment}`;
      } else {
        hourLabel = `${arrayOfWeekdays[hourObj.day]}: ${formatHours(
          hourObj.starthours,
        )} - ${formatHours(hourObj.endhours)}`;
      }
      return (
        <li className="vads-u-margin-bottom--0" key={hourObj.day}>
          {hourLabel}
        </li>
      );
    });
    return (
      <ul className="vads-u-flex--1 va-c-facility-hours-list vads-u-margin-top--0 vads-u-margin-bottom--1 small-screen:vads-u-margin-bottom--0 vads-u-margin-right--3">
        {hoursListItems}
      </ul>
    );
  };

  return (
    <div className="vads-u-margin-bottom--3" id="vet-center-hours">
      <h3 className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
        Hours
      </h3>
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row vads-u-margin-bottom--0">
        {buildHours(props.hours)}
      </div>
    </div>
  );
};

VetCenterHours.propTypes = {
  hours: PropTypes.array,
};

export default VetCenterHours;
