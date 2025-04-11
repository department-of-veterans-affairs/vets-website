import React from 'react';
import { get } from 'lodash';
import { LocationForHoursTypes } from '../types';
import { FacilityType, LocationType } from '../constants';
import { formatOperatingHours } from '../utils/helpers';

const LocationHours = ({ location }) => {
  const hoursInfo = get(location, 'attributes.hours');
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const renderHoursByDay = () => {
    return days.map((day, idx) => {
      const hours = formatOperatingHours(get(hoursInfo, day));
      const dayToDisplay = day.charAt(0).toUpperCase() + day.slice(1);

      if (hours) {
        return (
          <div key={`${day}-${idx}`} className="row">
            <p className="small-6 columns vads-u-margin--0">{dayToDisplay}:</p>
            <p
              data-testid={`${day}-hours`}
              className="small-6 columns vads-u-margin--0"
            >
              {hours}
            </p>
          </div>
        );
      }

      return null;
    });
  };

  const facilityType = get(location, 'attributes.facilityType');
  const isVetCenter = facilityType === LocationType.VET_CENTER;
  const isCemetery = facilityType === FacilityType.VA_CEMETERY;
  const title = isCemetery ? 'Open for visitation' : 'Hours of operation';

  if ((Array.isArray(hoursInfo) && !hoursInfo.length) || !hoursInfo) {
    return null;
  }

  return (
    <div id="hours-op">
      <h3>{title}</h3>
      {renderHoursByDay()}
      {isVetCenter && (
        <p>
          In addition to the hours listed above, all Vet Centers maintain
          non-traditional hours that are specific to each site and can change
          periodically given local Veteran, Service member & Family needs.
          Please contact your Vet Center to obtain the current schedule.
        </p>
      )}
    </div>
  );
};

LocationHours.propTypes = LocationForHoursTypes;

export default LocationHours;
