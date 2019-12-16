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
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row">
        <div className="vads-l-col--8 xsmall-screen:vads-l-col--12">
          <div className="vads-l-row">
            <div className="vads-l-col--3 xsmall-screen:vads-l-col--4 small-screen:vads-l-col--3 medium-screen:vads-l-col--2 vads-u-font-weight--bold">
              Hours:
            </div>
            <div className="vads-l-col--9 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--6">
              <div className="vads-l-row">
                {/* Sunday */}
                {sunday && (
                  <>
                    <div className="vaos-facility-details__day vads-l-col--6 xsmall-screen:vads-l-col--7">
                      Sunday
                    </div>
                    <div className="vaos-facility-details__hours vads-l-col--6 xsmall-screen:vads-l-col--5">
                      {sunday}
                    </div>
                  </>
                )}

                {/* Monday */}
                {monday && (
                  <>
                    <div className="vaos-facility-details__day vads-l-col--6 xsmall-screen:vads-l-col--7">
                      Monday
                    </div>
                    <div className="vaos-facility-details__hours vads-l-col--6 xsmall-screen:vads-l-col--5">
                      {monday}
                    </div>
                  </>
                )}

                {/* Tuesday */}
                {tuesday && (
                  <>
                    <div className="vaos-facility-details__day vads-l-col--6 xsmall-screen:vads-l-col--7">
                      Tuesday
                    </div>
                    <div className="vaos-facility-details__hours vads-l-col--6 xsmall-screen:vads-l-col--5">
                      {tuesday}
                    </div>
                  </>
                )}

                {/* Wednesday */}
                {wednesday && (
                  <>
                    <div className="vaos-facility-details__day vads-l-col--6 xsmall-screen:vads-l-col--7">
                      Wednesday
                    </div>
                    <div className="vaos-facility-details__hours vads-l-col--6 xsmall-screen:vads-l-col--5">
                      {wednesday}
                    </div>
                  </>
                )}

                {/* Thursday */}
                {thursday && (
                  <>
                    <div className="vaos-facility-details__day vads-l-col--6 xsmall-screen:vads-l-col--7">
                      Thursday
                    </div>
                    <div className="vaos-facility-details__hours vads-l-col--6 xsmall-screen:vads-l-col--5">
                      {thursday}
                    </div>
                  </>
                )}

                {/* Friday */}
                {friday && (
                  <>
                    <div className="vaos-facility-details__day vads-l-col--6 xsmall-screen:vads-l-col--7">
                      Friday
                    </div>
                    <div className="vaos-facility-details__hours vads-l-col--6 xsmall-screen:vads-l-col--5">
                      {friday}
                    </div>
                  </>
                )}

                {/* Saturday */}
                {saturday && (
                  <>
                    <div className="vaos-facility-details__day vads-l-col--6 xsmall-screen:vads-l-col--7">
                      Saturday
                    </div>
                    <div className="vaos-facility-details__hours vads-l-col--6 xsmall-screen:vads-l-col--5">
                      {saturday}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {isVetCenter && (
            <p>
              In addition to the hours listed above, all Vet Centers maintain
              non-traditional hours that are specific to each site and can
              change periodically given local Veteran, Service member & Family
              needs. Please contact your Vet Center to obtain the current
              schedule.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacilityHours;
