import React from 'react';
import { formatDateLong } from 'platform/utilities/date';

function PreferredDates(props) {
  const dates = props.dates?.map((selected, i) => (
    <li key={i}>
      {formatDateLong(selected.date)}
      {selected.optionTime?.toLowerCase() === 'am'
        ? ' in the morning'
        : ' in the afternoon'}
    </li>
  ));

  return dates;
}

export default PreferredDates;
