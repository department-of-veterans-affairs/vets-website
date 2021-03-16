import React from 'react';
import moment from 'moment';
import { getTimezoneAbbrBySystemId } from '../../../utils/timezone';

export default function AppointmentDate(props) {
  return props.dates?.map((selected, i) => (
    <h3 key={i} className="vaos-appts__block-label">
      {moment(selected, 'YYYY-MM-DDTHH:mm:ssZ').format(
        'dddd, MMMM DD, YYYY [at] h:mm a ',
      ) + getTimezoneAbbrBySystemId(props.systemId)}
    </h3>
  ));
}
