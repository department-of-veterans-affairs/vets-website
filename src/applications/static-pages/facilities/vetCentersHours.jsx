import React from 'react';
import PropTypes from 'prop-types';
import { formatHours } from '../../facility-locator/utils/formatHours';
import CallVetCenterForHours from './CallVetCenterForHours';

const VetCenterHours = props => {
  const hoursH4Style = props.isSatelliteLocation
    ? 'force-small-header vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1'
    : 'vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1';
  if (props.hours.length === 0)
    return (
      <CallVetCenterForHours
        vetCenterHoursId={props.vetCenterHoursId}
        hoursH4Style={hoursH4Style}
      />
    );

  const arrayOfWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const buildHourItem = item => {
    // {day: 4, starthours: 700, endhours: 1730, comment: ""}
    if (
      item.starthours < 0 ||
      item.endhours < 0 ||
      !item.starthours ||
      !item.endhours
    ) {
      return (
        <div className="row">
          <div className="small-1 columns vads-u-padding-x--0 vads-u-padding-right--0">
            {arrayOfWeekdays[item.day]}:
          </div>
          <div className="small-9 columns vads-u-padding-x--0 vads-u-padding-right--0">
            {item.comment}
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="small-1 columns vads-u-padding-x--0 vads-u-padding-right--0">
            {arrayOfWeekdays[item.day]}:
          </div>
          <div className="small-9 columns vads-u-padding-x--0 vads-u-padding-right--0">
            {formatHours(item.starthours)} - {formatHours(item.endhours)}{' '}
            {item.comment}
          </div>
        </div>
      );
    }
  };

  const buildHoursSection = hours => {
    const hoursListItems = hours.map(hourObj => (
      <li className="vads-u-margin-bottom--0" key={hourObj.day}>
        {buildHourItem(hourObj)}
      </li>
    ));

    return (
      <ul className="vads-u-flex--1 va-c-facility-hours-list vads-u-margin-top--0 vads-u-margin-bottom--1 small-screen:vads-u-margin-bottom--0 vads-u-margin-right--3">
        {hoursListItems}
      </ul>
    );
  };

  return (
    <div id={props.vetCenterHoursId}>
      <h4 className={hoursH4Style}>Hours</h4>
      <div className="vads-u-flex-direction--column small-screen:vads-u-flex-direction--row vads-u-margin-bottom--0">
        {buildHoursSection(props.hours)}
      </div>
    </div>
  );
};

VetCenterHours.propTypes = {
  hours: PropTypes.array,
  vetCenterHoursId: PropTypes.string,
  isSatelliteLocation: PropTypes.bool,
};

export default VetCenterHours;
