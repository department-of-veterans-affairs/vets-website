import React from 'react';
import { formatDateLong } from 'platform/utilities/date';

function PreferredDates(props) {
  return props.dates?.map((selected, i) => (
    <li key={i}>
      {formatDateLong(selected.date)}
      {selected.optionTime?.toLowerCase() === 'am'
        ? ' in the morning'
        : ' in the afternoon'}
    </li>
  ));
}

export default PreferredDates;
