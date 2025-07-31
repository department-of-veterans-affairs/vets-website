import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import React from 'react';
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
        {dates?.map((date, index) => {
          return (
            <React.Fragment key={index}>
              <span>
                {formatInTimeZone(date, timezone, 'EEEE, MMMM d, yyyy')}
              </span>
              <br />
              <span>
                {formatInTimeZone(date, timezone, 'h:mm aaaa')} {timezoneAbbr}
              </span>
            </React.Fragment>
          );
        })}
      </>
    );
  }

  return dates?.map((date, i) => (
    <h3 key={i} className="vaos-appts__block-label">
      {formatInTimeZone(date, timezone, "EEEE, MMMM d, yyyy 'at' h:mm aaaa ") +
        getTimezoneAbbrByFacilityId(facilityId)}
    </h3>
  ));
}

AppointmentDate.propTypes = {
  dates: PropTypes.array.isRequired,
  facilityId: PropTypes.string.isRequired,
  classes: PropTypes.string,
  directSchedule: PropTypes.bool,
  level: PropTypes.number,
};
