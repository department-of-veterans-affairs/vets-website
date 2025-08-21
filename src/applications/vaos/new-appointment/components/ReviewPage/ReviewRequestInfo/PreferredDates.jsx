import React from 'react';
import moment from 'moment';
import { formatDateLong } from 'platform/utilities/date';

function PreferredDates(props) {
  return props.dates?.map((selected, i) => (
    <li key={i}>
      {formatDateLong(selected)}
      {moment(selected).hour() < 12 ? ' in the morning' : ' in the afternoon'}
    </li>
  ));
}

export default PreferredDates;
