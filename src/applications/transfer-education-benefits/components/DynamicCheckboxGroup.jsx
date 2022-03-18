import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
// import environment from 'platform/utilities/environment';
// import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
// import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
// import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import CheckboxGroup from '@department-of-veterans-affairs/component-library/CheckboxGroup';
import { fetchSponsors } from '../actions';

// import { apiRequest } from 'platform/utilities/api';

// const apiUrl = `${environment.API_URL}/covid_vaccine/v0/facilities/`;

function DynamicCheckboxGroup({
  getSponsors,
  // onChange,
  sponsors,
}) {
  // console.log(props);
  // const locationsList = null;
  // const upperContent = null;
  // const [locations, setLocations] = useState([]);
  // const [loading, setLoading] = useState(true); // app starts in a loading state
  // const [error, setError] = useState(false); // app starts with no error
  const [selected, setSelected] = useState(null); // app starts with no error

  // const alertContent = (
  //   <>
  //     <p>
  //       We’re sorry. We’re having trouble finding medical centers for you to
  //       choose from right now.
  //     </p>
  //     <p>
  //       We’ll match you with the closest medical center based on the address you
  //       provided. They’ll contact you when they have a vaccine for you.
  //     </p>
  //   </>
  // );

  useEffect(
    () => {
      if (!sponsors) {
        getSponsors();
      }
    },
    [getSponsors, sponsors],
  );

  // if (loading) {
  //   return <va-loading-indicator message="Loading your sponsors..." />;
  // }

  if (!sponsors || !sponsors.length) {
    // // there are no locations returned or there is an error
    // locationsList = (
    //   <AlertBox
    //     content={alertContent}
    //     headline="We can't share your closest medical centers"
    //     status="info"
    //   />
    // );
    return <h1>Alert: you don't have any sponsors</h1>;
  }

  const options =
    sponsors?.map((sponsor, index) => ({
      label: sponsor.name,
      value: `sponsor-${index}`,
    })) || [];
  options.push({
    label: 'Someone not listed here',
    value: 'someoneNotListed',
  });

  // locationsList = (
  //       <RadioButtons
  //         options={optionsList}
  //         label="Select your medical center"
  //         required
  //         value={selected}
  //         onValueChange={value => {
  //           onChange(value.value);
  //           setSelected(value);
  //         }}
  //       />
  // );
  return (
    <CheckboxGroup
      label="Checkbox Group"
      onKeyDown={function noRefCheck() {}}
      onMouseDown={function noRefCheck() {}}
      onValueChange={value => {
        // onChange(value.value);
        setSelected(value);
      }}
      options={options}
      required
      // values={{
      //   key: 'value',
      // }}
      values={{ key: selected?.value }}
    />
  );
}

const mapStateToProps = state => ({
  sponsors: state.data?.sponsors,
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DynamicCheckboxGroup);
