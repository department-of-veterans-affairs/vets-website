import React from 'react';
import moment from 'moment';
import { getTimezoneAbbrBySystemId } from '../../utils/timezone';

export default function AppointmentDate(props) {
  const dates = props.dates?.map((selected, i) => (
    <h2 key={i} className="vads-u-font-size--md">
      {moment(selected.datetime, 'YYYY-MM-DDThh:mm:ssZ').format(
        'MMMM DD, YYYY [at] h:mm a ',
      ) + getTimezoneAbbrBySystemId(props.systemId)}
      <br />
    </h2>
  ));

  return dates;
}
