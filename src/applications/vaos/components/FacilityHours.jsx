// Dependencies
import React from 'react';
import { get } from 'lodash';
// Relative
import { formatOperatingHours } from '../utils/formatters';

/**
 * VA Facility Known Operational Hours
 */
const FacilityHours = ({ location }) => {
  // Derive the formatted hours info.
  const hoursInfo = get(location, 'attributes.hours');

  // Derive the time ranges for each day.
  const sunday = formatOperatingHours(get(hoursInfo, 'sunday'));
  const monday = formatOperatingHours(get(hoursInfo, 'monday'));
  const tuesday = formatOperatingHours(get(hoursInfo, 'tuesday'));
  const wednesday = formatOperatingHours(get(hoursInfo, 'wednesday'));
  const thursday = formatOperatingHours(get(hoursInfo, 'thursday'));
  const friday = formatOperatingHours(get(hoursInfo, 'friday'));
  const saturday = formatOperatingHours(get(hoursInfo, 'saturday'));

  // Derive if the facility is a vet center.
  const facilityType = get(location, 'attributes.facilityType');
  const isVetCenter = facilityType === 'vet_center';

  return (
    <>
      <span className="vads-u-font-weight--bold">Hours:</span>
      <div className="vads-u-margin-left--3">
        {/* Sunday */}
        {sunday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Sunday</div>
            <div>{sunday}</div>
          </div>
        )}

        {/* Monday */}
        {monday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Monday</div>
            <div>{monday}</div>
          </div>
        )}

        {/* Tuesday */}
        {tuesday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Tuesday</div>
            <div>{tuesday}</div>
          </div>
        )}

        {/* Wednesday */}
        {wednesday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Wednesday</div>
            <div>{wednesday}</div>
          </div>
        )}

        {/* Thursday */}
        {thursday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Thursday</div>
            <div>{thursday}</div>
          </div>
        )}

        {/* Friday */}
        {friday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Friday</div>
            <div>{friday}</div>
          </div>
        )}

        {/* Saturday */}
        {saturday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Saturday</div>
            <div>{saturday}</div>
          </div>
        )}
      </div>
      {isVetCenter && (
        <p>
          In addition to the hours listed above, all Vet Centers maintain
          non-traditional hours that are specific to each site and can change
          periodically given local Veteran, Service member & Family needs.
          Please contact your Vet Center to obtain the current schedule.
        </p>
      )}
    </>
  );
};

export default FacilityHours;
