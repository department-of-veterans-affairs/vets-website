import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import {
  VaButton,
  VaModal,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  geolocateUser,
  clearGeocodeError,
  fetchSearchByLocationResults,
} from '../../actions';

const SearchByProgram = () => {
  const distanceDropdownOptions = [
    { value: '5', label: 'within 5 miles' },
    { value: '15', label: 'within 15 miles' },
    { value: '25', label: 'within 25 miles' },
    { value: '50', label: 'within 50 miles' },
    { value: '75', label: 'within 75 miles' },
  ];
  const dispatch = useDispatch();
  const search = useSelector(state => state.search);
  const [distance, setDistance] = useState(search.query.distance);
  const [location, setLocation] = useState(search.query.location);
  const [programName, setProgramName] = useState(null);
  const [searchDirty, setSearchDirty] = useState(false);

  const handleLocateUser = e => {
    e.preventDefault();
    recordEvent({
      event: 'map-use-my-location',
    });
    dispatch(geolocateUser());
  };

  const handleSearch = () => {
    if (!searchDirty) {
      setSearchDirty(true);
      return;
    }
    const description = programName;
    dispatch(
      fetchSearchByLocationResults(location, distance, null, null, description),
    );
    // Go to program results page...
  };

  return (
    <div className="vads-u-display--flex mobile:vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row vads-u-justify-content--space-between mobile:vads-u-align-items--flex-start medium-screen:vads-u-align-items--flex-end">
      <VaModal
        modalTitle={
          search.geocodeError === 1
            ? 'We need to use your location'
            : "We couldn't locate you"
        }
        onCloseEvent={() => dispatch(clearGeocodeError())}
        status="warning"
        visible={search.geocodeError > 0}
      >
        <p>
          {search.geocodeError === 1
            ? 'Please enable location sharing in your browser to use this feature.'
            : 'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.'}
        </p>
      </VaModal>
      <VaTextInput
        className="tablet:vads-u-flex--3 mobile:vads-u-width--full vads-u-margin-right--2p5 mobile:vads-u-margin-top--neg2p5"
        name="program-name"
        type="text"
        label="Name of program"
        required
        value={programName}
        error={
          searchDirty && !programName ? 'Please fill in a program name.' : null
        }
        onInput={e => setProgramName(e.target.value)}
      />
      <VaTextInput
        className="tablet:vads-u-flex--3 mobile:vads-u-width--full vads-u-margin-right--2p5"
        name="program-location"
        type="text"
        label="City, state, or postal code"
        required
        value={location}
        error={
          searchDirty && !location
            ? 'Please fill in a city, state, or postal code.'
            : null
        }
        onInput={e => setLocation(e.target.value)}
      />
      <div className="medium-screen:vads-u-flex--2 tablet:vads-u-flex--auto vads-u-margin-right--2p5 mobile:vads-u-margin-top--2p5">
        {search.geolocationInProgress ? (
          <div className="vads-u-display--flex vads-u-align-items--center vads-u-color--primary">
            <va-icon size={3} icon="autorenew" aria-hidden="true" />
            <span aria-live="assertive">Finding your location...</span>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
            <button
              type="button"
              className="vads-u-line-height--3 vads-u-padding--0 vads-u-margin--0 vads-u-color--primary vads-u-background-color--white vads-u-font-weight--normal"
              onClick={handleLocateUser}
            >
              <va-icon icon="near_me" size={3} />
              Use my location
            </button>
          </>
        )}
        <VaSelect
          name="program-distance"
          onVaSelect={e => setDistance(e.target.value)}
          value={distance}
        >
          {distanceDropdownOptions.map(option => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </VaSelect>
      </div>
      <VaButton
        className="vads-u-flex--auto mobile:vads-u-margin-top--2p5"
        onClick={handleSearch}
        text="Search"
      />
    </div>
  );
};

export default SearchByProgram;
