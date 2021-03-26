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
  let upperContent = null;
  const [locations, setLocations] = useState([]);
  const [loading, isLoading] = useState(true); // app starts in a loading state
  const [error, setError] = useState(false); // app starts with no error

  useEffect(
    () => {
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
    upperContent = (
      <>
        <p>
          These are the VA medical centers closest to where you live. Select one
          or more medical centers you're willing to go to get a COVID-19
          vaccine. If you don't select any, we'll match you with the first one
          on the list
        </p>
        <p>
          <strong>Note</strong>: if you get a vaccine that requires 2 doses to
          be fully effective, you'll need to return to the same VA medical
          center to get your second dose.
        </p>
      </>
    );
    locationsList = (
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
  } else if (locations.length === 0 && error === false && loading === false) {
    upperContent = '';
    // there are no locations returned
    locationsList = (
      <AlertBox
        content="based on the information you provided we will identify a facility near your location for vaccination."
        headline="Alert title"
        status="info"
      />
    );
  } else if (error === true && loading === false) {
    // there was an error
    upperContent = '';
    locationsList = (
      <AlertBox
        content="We're sorry. Something went wrong on our end. Please refresh this page or check back later."
        headline="Alert title"
        status="error"
      />
    );
  }
  return (
    <>
      {upperContent}
      {locationsList}
    </>
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
