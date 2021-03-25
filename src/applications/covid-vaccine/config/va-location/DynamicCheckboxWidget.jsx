import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { apiRequest } from 'platform/utilities/api';

export function DynamicCheckboxWidget(props) {
  // console.log(props);
  const { onChange } = props;
  const [locations, setLocations] = useState([]);

  useEffect(
    () => {
      apiRequest('/vaccine_locations').then(resp => {
        setLocations(resp.data.locations);
      });
    },
    [props.zipcode],
  );

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

function mapStateToProps(state) {
  return {
    zipcode: state.form.data.zipCode,
  };
}

export default connect(
  mapStateToProps,
  null,
)(DynamicCheckboxWidget);
