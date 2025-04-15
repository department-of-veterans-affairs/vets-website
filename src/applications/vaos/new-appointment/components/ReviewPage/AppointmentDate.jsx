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
  directSchedule = false,
}) {
  const Heading = `h${level}`;
  const timezone = getTimezoneByFacilityId(facilityId);
  const timezoneAbbr = getTimezoneAbbrByFacilityId(facilityId);

  if (directSchedule) {
    return (
      <>
        <Heading
          className={classes || 'vads-u-font-size--h3 vads-u-margin-top--0'}
        >
          Date and time
        </Heading>
        {dates?.map(selected => {
          const dateTime =
            selected.endsWith('Z') && timezone
              ? moment(selected).tz(timezone)
              : moment(selected, 'YYYY-MM-DDTHH:mm:ssZ');
          return (
            <>
              <span>{dateTime.format('dddd, MMMM D, YYYY')}</span>
              <br />
              <span>
                {dateTime.format('h:mm a')} {timezoneAbbr}
              </span>
            </>
          );
        })}
      </>
    );
  }

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
  directSchedule: PropTypes.bool,
  level: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
};
