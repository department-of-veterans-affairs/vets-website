import React from 'react';
import moment from '../../utils/moment-tz';

export default function AppointmentDate(props) {
  const dates = props.dates?.map((selected, i) => (
    <h2 key={i} className="vads-u-font-size--md">
      {moment
        .tz(selected.datetime, 'YYYY-MM-DDThh:mm:ssZ', moment.tz.guess())
        .format('MMMM DD, YYYY [at] h:mm a z')}
      <br />
    </h2>
  ));

  return dates;
}
