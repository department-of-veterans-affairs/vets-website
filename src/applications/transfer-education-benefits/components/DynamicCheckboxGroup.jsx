import React, { useEffect } from 'react';
import { connect } from 'react-redux';
// import environment from 'platform/utilities/environment';
// import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
// import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
// import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import CheckboxGroup from '@department-of-veterans-affairs/component-library/CheckboxGroup';
import { isArray, cloneDeep } from 'lodash';
import { fetchSponsors, updateSelectedSponsors } from '../actions';
import {
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

// import { apiRequest } from 'platform/utilities/api';

// const apiUrl = `${environment.API_URL}/covid_vaccine/v0/facilities/`;

function DynamicCheckboxGroup({
  dispatchSelectedSponsorsChange,
  getSponsors,
  sponsors,
}) {
  // console.log(props);
  // const locationsList = null;
  // const upperContent = null;
  // const [locations, setLocations] = useState([]);
  // const [loading, setLoading] = useState(true); // app starts in a loading state
  // const [error, setError] = useState(false); // app starts with no error
  // const [selected, setSelected] = useState(null); // app starts with no error

  // const [selectedSponsors, setSelectedSponsors] = useState([]);

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
      if (!sponsors?.sponsors) {
        getSponsors();
      }
    },
    [getSponsors, sponsors],
  );

  if (!sponsors.sponsors || !sponsors.sponsors.length) {
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
    sponsors?.sponsors?.map((sponsor, index) => ({
      label: sponsor.name,
      value: index,
    })) || [];
  options.push({
    label: SPONSOR_NOT_LISTED_LABEL,
    value: SPONSOR_NOT_LISTED_VALUE,
  });

  const onValueChange = ({ value }, checked) => {
    const _sponsors = cloneDeep(sponsors);

    if (value === SPONSOR_NOT_LISTED_VALUE) {
      _sponsors.someoneNotListed = checked;
    }

    const sponsorIndex = Number.parseInt(value, 10);
    if (
      !Number.isNaN(sponsorIndex) &&
      sponsorIndex < sponsors?.sponsors?.length
    ) {
      _sponsors.sponsors[sponsorIndex].selected = checked;
    }

    dispatchSelectedSponsorsChange(_sponsors);

    // const option = options.find(o => o.value === value);
    // const _sponsors = sponsors?.slice();
    // if (checked) {
    //   _selectedSponsors.push([option]);
    // } else {
    //   const indexToRemove = selectedSponsors.findIndex(
    //     ss => ss.value === value,
    //   );

    //   // If we can't find the item to remove in the list of
    //   // existing items, don't dispatch an update.
    //   if (indexToRemove === -1) {
    //     return;
    //   }

    //   _selectedSponsors.splice(indexToRemove, 1);
    // }

    // // setSelectedSponsors(_selectedSponsors);
    // dispatchSelectedSponsorsChange(_selectedSponsors);
  };

  // if (loading) {
  //   return <va-loading-indicator message="Loading your sponsors..." />;
  // }

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
      onValueChange={onValueChange}
      options={options}
      required
      values={
        new Map(
          sponsors?.sponsors?.map(sponsor => [sponsor.value, sponsor.selected]),
        )
      }
    />
  );
}

const mapSponsors = state => {
  if (isArray(state.form.data['view:sponsors']?.sponsors)) {
    return state.form.data['view:sponsors'];
  }

  if (isArray(state.data?.sponsors?.sponsors)) {
    return {
      sponsors: state.data.sponsors,
    };
  }

  return {};
};

const mapStateToProps = state => ({
  sponsors: mapSponsors(state),
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
  dispatchSelectedSponsorsChange: updateSelectedSponsors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DynamicCheckboxGroup);
