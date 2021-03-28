import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import environment from 'platform/utilities/environment';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { apiRequest } from 'platform/utilities/api';

const apiUrl = `${environment.API_URL}/covid_vaccine/v0/facilities/`;

export function DynamicCheckboxWidget(props) {
  // console.log(props);
  const { onChange } = props;
  let locationsList = null;
  const [locations, setLocations] = useState([]);
  const [loading, isLoading] = useState(true); // app starts in a loading state
  const [error, setError] = useState(false); // app starts with no error

  useEffect(
    () => {
      // how sure are we that people will always enter 5 digits for their zipcode?
      if (props.zipcode && props.zipcode.length === 5) {
        apiRequest(`${apiUrl}${props.zipcode}`, {})
          .then(resp => {
            setLocations(resp.data);
            isLoading(false);
          })
          .catch(err => {
            isLoading(false);
            setError(true);
            return err;
          });
      }
    },
    [props.zipcode],
  );
  if (loading === true) {
    locationsList = (
      <LoadingIndicator message="Loading VA medical centers near you..." />
    );
  } else if (locations.length > 0 && loading === false) {
    locationsList = (
      <fieldset className="fieldset-input vads-u-margin-top--0">
        {locations.map((location, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`location-${index}`}
              value={location.attributes.name}
              onChange={_ => onChange(location.id)}
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
  } else if (
    (locations.length === 0 && loading === false && error === false) ||
    error === true
  ) {
    // there are no locations returned or there is an error
    locationsList = (
      <AlertBox
        content="based on the information you provided we will identify a facility near your location for vaccination."
        headline="Alert title"
        status="info"
      />
    );
  }
  return <>{locationsList}</>;
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
