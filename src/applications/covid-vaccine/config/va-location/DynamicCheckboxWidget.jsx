import React, { useState, useEffect } from 'react';

import { apiRequest } from 'platform/utilities/api';

export default function DynamicCheckboxWidget({
  onChange,
  // options = {},
}) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    apiRequest('/vaccine_locations').then(resp => {
      setLocations(resp.data.locations);
    });
  });

  return (
    <fieldset className="fieldset-input vads-u-margin-top--0">
      {locations.map((location, index) => (
        <div key={index}>
          <input
            type="checkbox"
            id={`location-${index}`}
            value={location.name}
            onChange={_ => onChange(location.name)}
          />
          <label name="undefined-0-label" htmlFor="default-0">
            <p className="vads-u-padding-left--4 vads-u-margin-top--neg3">
              {location.name}
            </p>
            <p className="vads-u-padding-left--4 vads-u-margin-top--neg2">
              {location.street}
            </p>
            <p className="vads-u-padding-left--4 vads-u-margin-top--neg2">{`${
              location.city
            } ${location.state}, ${location.zip}`}</p>
          </label>
        </div>
      ))}
    </fieldset>
  );
}
