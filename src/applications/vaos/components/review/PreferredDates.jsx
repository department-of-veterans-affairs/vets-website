import React from 'react';
import { formatDateLong } from '../../../../platform/utilities/date';

function PreferredDates(props) {
  const dates = props.dates?.map((selected, i) => (
    <span key={i}>
      {formatDateLong(selected.date)}
      {selected.optionTime?.toLowerCase() === 'am'
        ? ' in the morning'
        : ' in the evening'}
      <br />
    </span>
  ));

  return dates;
}

export default PreferredDates;
