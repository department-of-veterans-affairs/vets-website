import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import environment from 'platform/utilities/environment';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import { apiRequest } from 'platform/utilities/api';

const apiUrl = `${environment.API_URL}/covid_vaccine/v0/facilities/`;

export function DynamicRadioWidget(props) {
  // console.log(props);
  const { onChange } = props;
  let locationsList = null;
  let upperContent = null;
  const [locations, setLocations] = useState([]);
  const [loading, isLoading] = useState(true); // app starts in a loading state
  const [error, setError] = useState(false); // app starts with no error
  const [selected, setSelected] = useState(null); // app starts with no error

  const alertContent = (
    <>
      <p>
        We're sorry. We're having trouble finding medical centers for you to
        choose from right now.
      </p>
      <p>
        We'll match you with the closest medical center based on the address you
        provided. They’ll contact you when they have a vaccine for you.
      </p>
    </>
  );

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
    upperContent = (
      <>
        <p>
          These are the VA medical centers closest to where you live. Select the
          medical center you'd like to go to get a COVID-19 vaccine. If you
          don't select one, we'll match you with the first one on the list.
        </p>
        <p>
          <strong>Note</strong>: If you get a vaccine that requires 2 doses to
          be fully effective, you'll need to return to the same VA medical
          center to get your second dose.
        </p>
      </>
    );
    const optionsList = locations.map(location => ({
      label: (
        <>
          <p className="vads-u-padding-left--4 vads-u-margin-top--neg3">
            {location.attributes.name}
          </p>
          <p className="vads-u-padding-left--4 vads-u-margin-top--neg2">{`${
            location.attributes.city
          } ${location.attributes.state}`}</p>
        </>
      ),
      value: location.attributes.name,
    }));

    locationsList = (
      <RadioButtons
        options={optionsList}
        label="Select your medical center"
        value={selected}
        onValueChange={value => {
          onChange(value.value);
          setSelected(value);
        }}
      />
    );
  } else if (
    (locations.length === 0 && loading === false && error === false) ||
    error === true
  ) {
    // there are no locations returned or there is an error
    locationsList = (
      <AlertBox
        content={alertContent}
        headline="We can't share your closest medical centers"
        status="info"
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
)(DynamicRadioWidget);
