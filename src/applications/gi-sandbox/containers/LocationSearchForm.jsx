import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dropdown from '../components/Dropdown';
import {
  fetchLocationAutocompleteSuggestions,
  fetchSearchByLocationCoords,
  fetchSearchByLocationResults,
  updateAutocompleteLocation,
} from '../actions';
import KeywordSearch from '../components/search/KeywordSearch';
import { mapboxToken } from '../utils/mapboxToken';
import { getPosition } from '../utils/helpers';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

export function LocationSearchForm({
  autocomplete,
  dispatchFetchLocationAutocompleteSuggestions,
  dispatchFetchSearchByLocationCoords,
  dispatchFetchSearchByLocationResults,
  dispatchUpdateAutocompleteLocation,
  filters,
  preview,
  search,
}) {
  const [distance, setDistance] = useState(search.query.distance);

  const [streetAddress, setStreetAddress] = useState('');

  const [geolocationInProgress, setGeolocationInProgress] = useState(false);

  const [geolocationError, setGeolocationError] = useState(0);

  const { version } = preview;

  const checkGeolocationError = () => {
    navigator.geolocation.watchPosition(
      function() {
        setGeolocationError(0);
      },
      function(error) {
        if (error.code === 1) {
          setGeolocationError(1);
        } else if (error.code === 2) {
          setGeolocationError(2);
        } else if (error.code === 3) {
          setGeolocationError(3);
        }
      },
    );
  };

  const handleGeolocationButtonClick = () => {
    setGeolocationInProgress(true);
    getPosition()
      .then(position => {
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${position[1]},${
            position[0]
          }.json?access_token=${mapboxToken}`,
        )
          .then(response => response.json())
          .then(data => setStreetAddress(data.features[0].place_name));
        setGeolocationInProgress(false);
      })
      .catch(() => {
        checkGeolocationError();
        setGeolocationInProgress(false);
      });
  };

  const doSearch = event => {
    event.preventDefault();
    dispatchFetchSearchByLocationResults(
      streetAddress !== '' ? streetAddress : autocomplete.location,
      distance,
      filters,
    );
    setStreetAddress('');
  };

  const handleSelection = selected => {
    if (selected.coords) {
      dispatchFetchSearchByLocationCoords(
        selected.label,
        selected.coords,
        distance,
        filters,
      );
    } else {
      dispatchFetchSearchByLocationResults(
        streetAddress !== '' ? streetAddress : autocomplete.location,
        distance,
        filters,
      );
    }
  };

  const doAutocompleteSuggestionsSearch = value => {
    dispatchFetchLocationAutocompleteSuggestions(value);
  };

  return (
    <div>
      <div className="use-my-location-container">
        {geolocationInProgress ? (
          <div className="use-my-location-link">
            <i
              className="fa fa-spinner fa-spin"
              aria-hidden="true"
              role="presentation"
            />
            <span aria-live="assertive">Finding your location...</span>
          </div>
        ) : (
          <button
            onClick={handleGeolocationButtonClick}
            className="use-my-location-link"
          >
            <i
              className="use-my-location-button"
              aria-hidden="true"
              role="presentation"
            />
            Use my location
          </button>
        )}
      </div>
      <Modal
        title={
          geolocationError === 1
            ? 'We need to use your location'
            : "We couldn't locate you"
        }
        onClose={() => setGeolocationError(0)}
        status="warning"
        visible={geolocationError > 0}
        contents={
          <>
            <p>
              {geolocationError === 1
                ? 'Please enable location sharing in your browser to use this feature.'
                : 'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.'}
            </p>
          </>
        }
      />
      <form onSubmit={doSearch} className="vads-u-margin-y--0">
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--10">
            <KeywordSearch
              version={version}
              name="locationSearch"
              className="location-search"
              inputValue={
                streetAddress !== '' ? streetAddress : autocomplete.location
              }
              onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
              onPressEnter={e => doSearch(e)}
              onSelection={handleSelection}
              onUpdateAutocompleteSearchTerm={
                dispatchUpdateAutocompleteLocation
              }
              placeholder="city, state, or postal code"
              suggestions={[...autocomplete.locationSuggestions]}
            />
            <Dropdown
              className="vads-u-font-style--italic vads-u-display--inline-block vads-u-margin-left--4"
              selectClassName="vads-u-font-style--italic vads-u-color--gray"
              name="distance"
              options={[
                { optionValue: '5', optionLabel: 'within 5 miles' },
                { optionValue: '25', optionLabel: 'within 25 miles' },
                { optionValue: '50', optionLabel: 'within 50 miles' },
                { optionValue: '75', optionLabel: 'within 75 miles' },
              ]}
              value={distance}
              alt="distance"
              visible
              onChange={e => setDistance(e.target.value)}
            />
          </div>
          <div className="medium-screen:vads-l-col--2 vads-u-text-align--right">
            <button type="submit" className="usa-button">
              Search
              <i aria-hidden="true" className="fa fa-search" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  filters: state.filters,
  search: state.search,
  preview: state.preview,
});

const mapDispatchToProps = {
  dispatchFetchSearchByLocationResults: fetchSearchByLocationResults,
  dispatchFetchLocationAutocompleteSuggestions: fetchLocationAutocompleteSuggestions,
  dispatchFetchSearchByLocationCoords: fetchSearchByLocationCoords,
  dispatchUpdateAutocompleteLocation: updateAutocompleteLocation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSearchForm);
