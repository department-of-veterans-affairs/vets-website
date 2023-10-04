import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import environment from 'platform/utilities/environment';
// eslint-disable-next-line deprecate/import
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
        We’re sorry. We’re having trouble finding medical centers for you to
        choose from right now.
      </p>
      <p>
        We’ll match you with the closest medical center based on the address you
        provided. They’ll contact you when they have a vaccine for you.
      </p>
    </>
  );

  useEffect(
    () => {
      // how sure are we that people will always enter 5 digits for their zipcode?
      if (props.zipcode && props.zipcode.length === 5) {
        setSelected(null);
        onChange();
        apiRequest(`${apiUrl}${props.zipcode}`, {})
          .then(resp => {
            setLocations(resp.data);
            isLoading(false);
          })
          .catch(err => {
            isLoading(false);
            setSelected('');
            onChange('');
            setError(true);
            return err;
          });
      }
    },
    [props.zipcode],
  );

  if (loading === true) {
    locationsList = (
      <va-loading-indicator message="Loading VA medical centers near you..." />
    );
  } else if (locations.length > 0 && loading === false) {
    upperContent = (
      <>
        <p>
          These are the VA medical centers closest to where you live. Select the
          medical center you'd like to go to get a COVID-19 vaccine.
        </p>
        <p>
          <strong>Note</strong>: If you get a vaccine that requires 2 doses to
          be fully effective, you'll need to return to the same VA medical
          center to get your second dose.
        </p>
      </>
    );
    locationsList = (
      <VaRadio
        label="Select your medical center"
        value={selected}
        onVaValueChange={event => {
          onChange(event.detail.value);
          setSelected(event.detail.value);
        }}
      >
        {locations.map((location, index) => (
          <VaRadioOption
            key={`${location.value}-${index}`}
            label={`${location.attributes.name}`}
            description={`${location.attributes.city} ${
              location.attributes.state
            }`}
            value={`${location.attributes.name}|${location.id}`}
          />
        ))}
      </VaRadio>
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
