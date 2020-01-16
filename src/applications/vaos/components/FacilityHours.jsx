// Dependencies
import React from 'react';
// Relative
import { formatOperatingHours } from '../utils/formatters';

/**
 * VA Facility Known Operational Hours
 */
const FacilityHours = ({ location }) => {
  // Derive the formatted hours info.
  const hoursInfo = location?.hours;

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dayHours = days
    .map(day => ({
      day,
      hours: formatOperatingHours(hoursInfo?.[day.toLowerCase()]),
    }))
    .filter(day => !!day.hours);

  // Derive if the facility is a vet center.
  const facilityType = location?.facilityType;
  const isVetCenter = facilityType === 'vet_center';

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row">
        <div className="vads-l-col--8 xsmall-screen:vads-l-col--12">
          <div className="vads-l-row">
            <div className="vads-l-col--3 xsmall-screen:vads-l-col--4 small-screen:vads-l-col--3 medium-screen:vads-l-col--3 vads-u-font-weight--bold">
              Hours:
            </div>
            <div className="vads-l-col--9 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--9 medium-screen:vads-l-col--9">
              <div className="vads-l-row">
                {dayHours.map((d, index) => (
                  <React.Fragment key={`hours-${index}`}>
                    <div className="vaos-facility-details__day vads-l-col--6 xsmall-screen:vads-l-col--5 medium-screen:small-screen:vads-l-col--3">
                      <span className="vads-u-display--none small-screen:vads-u-display--inline">
                        {d.day}
                      </span>
                      <span className="small-screen:vads-u-display--none">
                        {d.day.slice(0, 3)}
                      </span>
                    </div>
                    <div className="vaos-facility-details__hours vads-l-col--6 xsmall-screen:vads-l-col--7 medium-screen:small-screen:vads-l-col--9">
                      {d.hours}
                    </div>
                  </React.Fragment>
                ))}
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
