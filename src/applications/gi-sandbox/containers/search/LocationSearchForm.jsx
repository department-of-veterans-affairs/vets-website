import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Dropdown from '../../components/Dropdown';
import {
  fetchLocationAutocompleteSuggestions,
  fetchSearchByLocationCoords,
  fetchSearchByLocationResults,
  updateAutocompleteLocation,
  geolocateUser,
  clearGeocodeError,
  mapChanged,
} from '../../actions';
import KeywordSearch from '../../components/search/KeywordSearch';
import 'mapbox-gl/dist/mapbox-gl.css';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { useHistory } from 'react-router-dom';
import { updateUrlParams } from '../../selectors/search';
import { TABS } from '../../constants';
import { INITIAL_STATE } from '../../reducers/search';

export function LocationSearchForm({
  autocomplete,
  dispatchFetchLocationAutocompleteSuggestions,
  dispatchFetchSearchByLocationCoords,
  dispatchFetchSearchByLocationResults,
  dispatchUpdateAutocompleteLocation,
  filters,
  preview,
  search,
  dispatchGeolocateUser,
  dispatchClearGeocodeError,
  dispatchMapChanged,
}) {
  const [distance, setDistance] = useState(search.query.distance);
  const [location, setLocation] = useState(search.query.location);
  const [autocompleteSelection, setAutocompleteSelection] = useState(null);
  const { version } = preview;
  const history = useHistory();
  const distanceDropdownOptions = [
    { optionValue: '5', optionLabel: 'within 5 miles' },
    { optionValue: '15', optionLabel: 'within 15 miles' },
    { optionValue: '25', optionLabel: 'within 25 miles' },
    { optionValue: '50', optionLabel: 'within 50 miles' },
    { optionValue: '75', optionLabel: 'within 75 miles' },
  ];

  useEffect(
    () => {
      if (
        search.loadFromUrl &&
        search.query.location !== null &&
        search.query.location !== ''
      ) {
        dispatchFetchSearchByLocationResults(
          search.query.location,
          distance,
          filters,
          version,
        );
      }
    },
    [search.loadFromUrl],
  );

  const doSearch = event => {
    if (event) {
      event.preventDefault();
    }
    let paramLocation = location;
    dispatchMapChanged({ changed: false, distance: null });

    if (autocompleteSelection?.coords) {
      paramLocation = autocompleteSelection.label;
      dispatchFetchSearchByLocationCoords(
        autocompleteSelection.label,
        autocompleteSelection.coords,
        distance,
        filters,
        version,
      );
    } else {
      dispatchFetchSearchByLocationResults(
        location,
        distance,
        filters,
        version,
      );
    }

    updateUrlParams(
      history,
      search.tab,
      { ...search.query, location: paramLocation, distance },
      filters,
      version,
    );
  };

  /**
   * Triggers a search for search form when the "Update results" button in "Filter your results"
   * is clicked
   */
  useEffect(
    () => {
      if (
        !search.loadFromUrl &&
        filters.search &&
        search.tab === TABS.location &&
        !search.query.mapState.changed
      ) {
        doSearch(null);
      }
    },
    [filters.search],
  );

  const doAutocompleteSuggestionsSearch = value => {
    dispatchFetchLocationAutocompleteSuggestions(value);
  };

  const onUpdateAutocompleteSearchTerm = value => {
    setLocation(value);
    dispatchUpdateAutocompleteLocation(value);
  };

  useEffect(
    () => {
      if (
        search.query.streetAddress.searchString !== null &&
        search.query.streetAddress.searchString !== ''
      )
        setLocation(search.query.streetAddress.searchString);
    },
    [search.query.streetAddress.searchString],
  );

  useEffect(
    () => {
      const distanceOption = distanceDropdownOptions.find(
        option => option.optionValue === search.query.distance,
      );
      setDistance(distanceOption?.optionValue || INITIAL_STATE.query.distance);
    },
    [search.query.distance],
  );

  return (
    <div className="location-search-form">
      <div className="use-my-location-container">
        {search.geolocationInProgress ? (
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
            onClick={dispatchGeolocateUser}
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
          search.geocodeError === 1
            ? 'We need to use your location'
            : "We couldn't locate you"
        }
        onClose={() => dispatchClearGeocodeError()}
        status="warning"
        visible={search.geocodeError > 0}
        contents={
          <>
            <p>
              {search.geocodeError === 1
                ? 'Please enable location sharing in your browser to use this feature.'
                : 'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.'}
            </p>
          </>
        }
      />
      <form onSubmit={doSearch} className="vads-u-margin-y--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--5 medium-screen:vads-l-col--7 input-row">
            <KeywordSearch
              version={version}
              name="locationSearch"
              className="location-search"
              inputValue={location}
              onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
              onPressEnter={e => doSearch(e)}
              onSelection={selected => setAutocompleteSelection(selected)}
              onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
              placeholder="city, state, or postal code"
              suggestions={[...autocomplete.locationSuggestions]}
            />
          </div>

          <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--4 medium-screen:vads-l-col--3 input-row">
            <Dropdown
              className="vads-u-font-style--italic"
              selectClassName="vads-u-font-style--italic vads-u-color--gray"
              name="distance"
              options={distanceDropdownOptions}
              value={distance}
              alt="distance"
              visible
              onChange={e => setDistance(e.target.value)}
            />
          </div>
          <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3 medium-screen:vads-l-col--2 vads-u-text-align--right input-row">
            <button type="submit" className="usa-button location-search-button">
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
  dispatchGeolocateUser: geolocateUser,
  dispatchClearGeocodeError: clearGeocodeError,
  dispatchMapChanged: mapChanged,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSearchForm);
