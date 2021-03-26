import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// import { apiRequest } from 'platform/utilities/api';

export function DynamicCheckboxWidget(props) {
  // console.log(props);
  const { onChange } = props;
  const [locations, setLocations] = useState([]);

  useEffect(
    () => {
      if (props.zipcode && props.zipcode.length === 5) {
        // This fetch call will be replaced with the apiRequest call below it when we are ready to merge
        fetch(
          `http://localhost:3000/covid_vaccine/v0/facilities/${props.zipcode}`,
        )
          .then(response => response.json())
          .then(data => {
            setLocations(data.data);
          });
        /* apiRequest(`/covid_vaccine/v0/facilities/${props.zipcode}`, {}).then(resp => {
          setLocations(resp.data.locations);
        }); */
      }
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
            value={location.attributes.name}
            onChange={_ => onChange(location.attributes.name)}
          />
          <label name="undefined-0-label" htmlFor="default-0">
            <p className="vads-u-padding-left--4 vads-u-margin-top--neg3">
              {location.attributes.name}
            </p>
            <p className="vads-u-padding-left--4 vads-u-margin-top--neg2">{`${
              location.attributes.city
            } ${location.attributes.state}`}</p>
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
