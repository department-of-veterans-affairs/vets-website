import React from 'react';
import { format } from 'date-fns';
import { DATE_FORMATS } from '../../../../utils/constants';

function PreferredDates(props) {
  return props.dates?.map((selected, i) => {
    const dateObj = new Date(selected);
    return (
      <li key={i}>
        {format(dateObj, DATE_FORMATS.friendlyWeekdayDate)}
        {dateObj.getHours() < 12 ? ' in the morning' : ' in the afternoon'}
      </li>
    );
  });
}

export default PreferredDates;
