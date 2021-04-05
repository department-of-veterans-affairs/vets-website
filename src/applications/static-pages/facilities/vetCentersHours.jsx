import React from 'react';
import PropTypes from 'prop-types';

// TODO fix spacing and add unit tests
const VetCenterHours = props => {
  const arrayOfWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatTime = hoursString => {
    // starthours: 700, endhours: 1730
    let hour = Number(
      hoursString.toString().length > 3
        ? hoursString.toString().substring(0, 2)
        : hoursString.toString().substring(0, 1),
    );
    const minutes = Number(
      hoursString.toString().length > 3
        ? hoursString.toString().substring(2, 4)
        : hoursString.toString().substring(1, 4),
    );
    let AMorPM = 'a.m.';
    if (hour >= 0 && hour <= 24 && minutes >= 0 && minutes <= 60) {
      if (hour > 12) AMorPM = 'p.m.';
      hour %= 12;
    }
    return `${hour}:${
      minutes === 0 ? `${minutes}${minutes}` : `${minutes}`
    } ${AMorPM}`;
  };
  const buildHours = hours => {
    const hoursListItems = [...hours.slice(-6), hours[0]].map(hourObj => {
      // {day: 4, starthours: 700, endhours: 1730, comment: ""}
      let hourLabel;
      if (hourObj.starthours < 0 || hourObj.endhours < 0) {
        hourLabel = `${arrayOfWeekdays[hourObj.day]}: ${hourObj.comment}`;
      } else {
        hourLabel = `${arrayOfWeekdays[hourObj.day]}: ${formatTime(
          hourObj.starthours,
        )} - ${formatTime(hourObj.endhours)}`;
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
        {buildHours(props.hoursMap)}
      </div>
    </div>
  );
};

VetCenterHours.propTypes = {
  hoursMap: PropTypes.array,
};

export default VetCenterHours;
