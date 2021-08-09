import React from 'react';
import moment from 'moment';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneBySystemId,
} from '../../../utils/timezone';

export default function AppointmentDate(props) {
  const timezone = getTimezoneBySystemId(props.systemId).timezone;
  return props.dates?.map((selected, i) => (
    <h3 key={i} className="vaos-appts__block-label">
      {moment
        .tz(selected, 'YYYY-MM-DDTHH:mm:ssZ', timezone)
        .format('dddd, MMMM DD, YYYY [at] h:mm a ') +
        getTimezoneAbbrBySystemId(props.systemId)}
    </h3>
  ));
}
