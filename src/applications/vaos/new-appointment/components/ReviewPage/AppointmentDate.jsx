import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  getTimezoneAbbrByFacilityId,
  getTimezoneByFacilityId,
} from '../../../utils/timezone';

export default function AppointmentDate({
  classes,
  dates,
  facilityId,
  level = 3,
}) {
  const Heading = `h${level}`;
  const timezone = getTimezoneByFacilityId(facilityId);

  if (dates[0].endsWith('Z') && timezone) {
    return dates?.map((selected, i) => (
      <Heading key={i} className={classes || 'vaos-appts__block-label'}>
        {moment(selected)
          .tz(timezone)
          .format('dddd, MMMM D, YYYY [at] h:mm a ') +
          getTimezoneAbbrByFacilityId(facilityId)}
      </Heading>
    ));
  }
  return dates?.map((selected, i) => (
    <h3 key={i} className="vaos-appts__block-label">
      {moment(selected, 'YYYY-MM-DDTHH:mm:ssZ').format(
        'dddd, MMMM D, YYYY [at] h:mm a ',
      ) + getTimezoneAbbrByFacilityId(facilityId)}
    </h3>
  ));
}

AppointmentDate.propTypes = {
  dates: PropTypes.array.isRequired,
  facilityId: PropTypes.string.isRequired,
  classes: PropTypes.string,
  level: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
};
