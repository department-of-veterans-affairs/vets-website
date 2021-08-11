import React from 'react';
import moment from 'moment';
import {
  getTimezoneAbbrByFacilityId,
  getTimezoneByFacilityId,
} from '../../../utils/timezone';

export default function AppointmentDate(props) {
  const timezone = getTimezoneByFacilityId(props.facilityId);
  if (props.dates[0].endsWith('Z') && timezone) {
    return props.dates?.map((selected, i) => (
      <h3 key={i} className="vaos-appts__block-label">
        {moment(selected)
          .tz(timezone)
          .format('dddd, MMMM DD, YYYY [at] h:mm a ') +
          getTimezoneAbbrByFacilityId(props.facilityId)}
      </h3>
    ));
  }
  return props.dates?.map((selected, i) => (
    <h3 key={i} className="vaos-appts__block-label">
      {moment(selected, 'YYYY-MM-DDTHH:mm:ssZ').format(
        'dddd, MMMM DD, YYYY [at] h:mm a ',
      ) + getTimezoneAbbrByFacilityId(props.facilityId)}
    </h3>
  ));
}
