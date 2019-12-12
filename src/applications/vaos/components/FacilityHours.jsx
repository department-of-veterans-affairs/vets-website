// Dependencies
import React from 'react';
// Relative
import { formatOperatingHours } from '../utils/formatters';

/**
 * VA Facility Known Operational Hours
 */
const FacilityHours = ({ location }) => {
  // Derive the formatted hours info.
  const hoursInfo = location?.attributes?.hours;

  // Derive the time ranges for each day.
  const sunday = formatOperatingHours(hoursInfo?.sunday);
  const monday = formatOperatingHours(hoursInfo?.monday);
  const tuesday = formatOperatingHours(hoursInfo?.tuesday);
  const wednesday = formatOperatingHours(hoursInfo?.wednesday);
  const thursday = formatOperatingHours(hoursInfo?.thursday);
  const friday = formatOperatingHours(hoursInfo?.friday);
  const saturday = formatOperatingHours(hoursInfo?.saturday);

  // Derive if the facility is a vet center.
  const facilityType = location?.attributes?.facilityType;
  const isVetCenter = facilityType === 'vet_center';

  return (
    <>
      <span className="vads-u-font-weight--bold">Hours:</span>
      <div className="vads-u-margin-left--3">
        {/* Sunday */}
        {sunday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Sunday</div>
            <div className="vaos-facility-details__hours">{sunday}</div>
          </div>
        )}

        {/* Monday */}
        {monday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Monday</div>
            <div className="vaos-facility-details__hours">{monday}</div>
          </div>
        )}

        {/* Tuesday */}
        {tuesday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Tuesday</div>
            <div className="vaos-facility-details__hours">{tuesday}</div>
          </div>
        )}

        {/* Wednesday */}
        {wednesday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Wednesday</div>
            <div className="vaos-facility-details__hours">{wednesday}</div>
          </div>
        )}

        {/* Thursday */}
        {thursday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Thursday</div>
            <div className="vaos-facility-details__hours">{thursday}</div>
          </div>
        )}

        {/* Friday */}
        {friday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Friday</div>
            <div className="vaos-facility-details__hours">{friday}</div>
          </div>
        )}

        {/* Saturday */}
        {saturday && (
          <div className="vads-u-display--flex">
            <div className="vaos-facility-details__day">Saturday</div>
            <div className="vaos-facility-details__hours">{saturday}</div>
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
