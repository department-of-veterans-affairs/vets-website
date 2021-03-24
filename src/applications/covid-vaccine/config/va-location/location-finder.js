import React from 'react';
import { mockLocations } from './mockData';

export const LocationFinder = () => {
  return (
    <fieldset className="fieldset-input">
      {mockLocations.map((location, index) => (
        <div key={index}>
          <input
            type="checkbox"
            id={`location-${index}`}
            value={location.name}
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
};
