/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import Dropdown from '../../components/Dropdown';
import FilterBeforeResults from './FilterBeforeResults';
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
  smallScreen,
}) {
  const [distance, setDistance] = useState(search.query.distance);
  const [location, setLocation] = useState(search.query.location);
  const [error, setError] = useState(null);
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

  const validateSearchTerm = searchTerm => {
    const invalidZipCodePattern = /^\d{6,}$/;

    if (searchTerm.trim() === '') {
      setError('Please fill in a city, state, or postal code.');
    } else if (invalidZipCodePattern.test(searchTerm)) {
      setError('Please enter a valid postal code.');
    } else if (error !== null) {
      setError(null);
    }
  };

  const doSearch = event => {
    if (event) {
      event.preventDefault();
    }
    let paramLocation = location;
    dispatchMapChanged({ changed: false, distance: null });

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'locationSearch',
      'gibct-form-value': location,
    });

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
      if (location.trim() !== '') {
        dispatchFetchSearchByLocationResults(
          location,
          distance,
          filters,
          version,
        );
      }

      if (event) {
        validateSearchTerm(location);
      }
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

  useEffect(
    () => {
      doSearch(null);
    },

    [autocompleteSelection],
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
          <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--7 medium-screen:vads-l-col--7 input-row">
            <KeywordSearch
              className="location-search"
              error={error}
              inputValue={location}
              label="City, state, or postal code"
              labelAdditional={
                <span className="use-my-location-container">
                  {search.geolocationInProgress ? (
                    <div className="use-my-location-link">
                      <i
                        className="fa fa-spinner fa-spin"
                        aria-hidden="true"
                        role="presentation"
                      />
                      <span aria-live="assertive">
                        Finding your location...
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      name="use-my-location"
                      onClick={evnt => {
                        if (document.activeElement.name !== 'use-my-location') {
                          return;
                        }
                        recordEvent({
                          event: 'map-use-my-location',
                        });
                        dispatchGeolocateUser();
                        setAutocompleteSelection(location);
                        doSearch(evnt);
                      }}
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
                </span>
              }
              name="locationSearch"
              onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
              onPressEnter={e => {
                setAutocompleteSelection(null);
                doSearch(e);
              }}
              onSelection={selected => setAutocompleteSelection(selected)}
              onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
              suggestions={[...autocomplete.locationSuggestions]}
              validateSearchTerm={validateSearchTerm}
              version={version}
            />
          </div>

          <div className="location-search-inputs vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--5 medium-screen:vads-l-col--5 input-row">
            <div className="bottom-positioner">
              <Dropdown
                ariaLabel="Distance"
                className="vads-u-font-style--italic vads-u-display--inline-block "
                selectClassName="vads-u-font-style--italic vads-u-color--gray"
                name="distance"
                options={distanceDropdownOptions}
                value={distance}
                alt="distance"
                visible
                onChange={e => {
                  recordEvent({
                    event: 'gibct-form-change',
                    'gibct-form-field': 'locationRadius',
                    'gibct-form-value': e.target.value,
                  });
                  setDistance(e.target.value);
                }}
              />
              <button
                type="submit"
                className="usa-button location-search-button"
              >
                Search
                <i aria-hidden="true" className="fa fa-search" />
              </button>
            </div>
          </div>
        </div>
      </form>
      {!smallScreen &&
        !environment.isProduction() && (
          <div>
            <FilterBeforeResults />
          </div>
        )}
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
