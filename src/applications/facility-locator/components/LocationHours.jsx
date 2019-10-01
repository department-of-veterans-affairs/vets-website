import { get } from 'lodash';
import React from 'react';

/**
 * VA Facility Known Operational Hours
 */
const LocationHours = ({ location }) => {
  // Derive the hours for each day.
  const hoursInfo = get(location, 'attributes.hours');
  const sunday = get(hoursInfo, 'sunday', 'N/A');
  const monday = get(hoursInfo, 'monday', 'N/A');
  const tuesday = get(hoursInfo, 'tuesday', 'N/A');
  const wednesday = get(hoursInfo, 'wednesday', 'N/A');
  const thursday = get(hoursInfo, 'thursday', 'N/A');
  const friday = get(hoursInfo, 'friday', 'N/A');
  const saturday = get(hoursInfo, 'saturday', 'N/A');

  return (
    <div>
      <h4 className="highlight">Hours of Operation</h4>

      {/* Sunday */}
      <div className="row">
        <div className="small-6 columns">Sunday:</div>
        <div className="small-6 columns">{sunday}</div>
      </div>

      {/* Monday */}
      <div className="row">
        <div className="small-6 columns">Monday:</div>
        <div className="small-6 columns">{monday}</div>
      </div>

      {/* Tuesday */}
      <div className="row">
        <div className="small-6 columns">Tuesday:</div>
        <div className="small-6 columns">{tuesday}</div>
      </div>

      {/* Wednesday */}
      <div className="row">
        <div className="small-6 columns">Wednesday:</div>
        <div className="small-6 columns">{wednesday}</div>
      </div>

      {/* Thursday */}
      <div className="row">
        <div className="small-6 columns">Thursday:</div>
        <div className="small-6 columns">{thursday}</div>
      </div>

      {/* Friday */}
      <div className="row">
        <div className="small-6 columns">Friday:</div>
        <div className="small-6 columns">{friday}</div>
      </div>

      {/* Saturday */}
      <div className="row">
        <div className="small-6 columns">Saturday:</div>
        <div className="small-6 columns">{saturday}</div>
      </div>

      {get(location, 'attributes.facilityType') === 'vet_center' && (
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

export default LocationHours;
