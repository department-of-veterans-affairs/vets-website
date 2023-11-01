// Dependencies
import React from 'react';
import { get } from 'lodash';
// Relative
import { LocationType, FacilityType } from '../constants';
import { formatOperatingHours } from '../utils/helpers';

/**
 * VA Facility Known Operational Hours
 */
const LocationHours = ({ location, showHoursSpecialInstructions }) => {
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
  const isVetCenter = facilityType === LocationType.VET_CENTER;
  const isVaHealth = facilityType === FacilityType.VA_HEALTH_FACILITY;
  const { operationalHoursSpecialInstructions } = location.attributes;

  return (
    <div id="hours-op">
      <h3 className="highlight">Hours of operation</h3>

      {/* Sunday */}
      {sunday && (
        <div className="row">
          <div className="small-6 columns">Sunday:</div>
          <div className="small-6 columns">{sunday}</div>
        </div>
      )}

      {/* Monday */}
      {monday && (
        <div className="row">
          <div className="small-6 columns">Monday:</div>
          <div className="small-6 columns">{monday}</div>
        </div>
      )}

      {/* Tuesday */}
      {tuesday && (
        <div className="row">
          <div className="small-6 columns">Tuesday:</div>
          <div className="small-6 columns">{tuesday}</div>
        </div>
      )}

      {/* Wednesday */}
      {wednesday && (
        <div className="row">
          <div className="small-6 columns">Wednesday:</div>
          <div className="small-6 columns">{wednesday}</div>
        </div>
      )}

      {/* Thursday */}
      {thursday && (
        <div className="row">
          <div className="small-6 columns">Thursday:</div>
          <div className="small-6 columns">{thursday}</div>
        </div>
      )}

      {/* Friday */}
      {friday && (
        <div className="row">
          <div className="small-6 columns">Friday:</div>
          <div className="small-6 columns">{friday}</div>
        </div>
      )}

      {/* Saturday */}
      {saturday && (
        <div className="row">
          <div className="small-6 columns">Saturday:</div>
          <div className="small-6 columns">{saturday}</div>
        </div>
      )}

      {isVetCenter && (
        <p>
          In addition to the hours listed above, all Vet Centers maintain
          non-traditional hours that are specific to each site and can change
          periodically given local Veteran, Service member & Family needs.
          Please contact your Vet Center to obtain the current schedule.
        </p>
      )}

      {isVaHealth &&
        showHoursSpecialInstructions &&
        operationalHoursSpecialInstructions && (
          <p id="operational-special-p">
            {operationalHoursSpecialInstructions}
          </p>
        )}
    </div>
  );
};

export default LocationHours;
