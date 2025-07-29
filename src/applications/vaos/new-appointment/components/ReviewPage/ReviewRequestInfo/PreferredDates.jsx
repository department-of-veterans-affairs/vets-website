import { formatDateLong } from 'platform/utilities/date';
import React from 'react';

function PreferredDates(props) {
  return props.dates?.map((selected, i) => (
    <li key={i}>
      {formatDateLong(selected)}
      {new Date(selected).getHours() < 12
        ? ' in the morning'
        : ' in the afternoon'}
    </li>
  ));
}

export default PreferredDates;
