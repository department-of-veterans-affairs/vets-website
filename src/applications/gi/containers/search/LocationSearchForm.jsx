/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, createRef } from 'react';
import { connect } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
  setError,
} from '../../actions';
import KeywordSearch from '../../components/search/KeywordSearch';
import 'mapbox-gl/dist/mapbox-gl.css';
import { updateUrlParams } from '../../selectors/search';
import { TABS } from '../../constants';
import { INITIAL_STATE } from '../../reducers/search';
import { validateSearchTerm } from '../../utils/helpers';

export function LocationSearchForm({
  autocomplete,
  dispatchFetchLocationAutocompleteSuggestions,
  dispatchFetchSearchByLocationCoords,
  dispatchFetchSearchByLocationResults,
  dispatchUpdateAutocompleteLocation,
  dispatchError,
  errorReducer,
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
  const inputRef = createRef();
  // const [error, setError] = useState(null);
  const { error } = errorReducer;
  const [autocompleteSelection, setAutocompleteSelection] = useState(null);
  const [showFiltersBeforeSearch, setShowFiltersBeforeSearch] = useState(true);
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

  // const validateSearchTerm = searchTerm => {
  //   const invalidZipCodePattern = /^\d{6,}$/;

  //   if (searchTerm.trim() === '') {
  //     setError('Please fill in a city, state, or postal code.');
  //   } else if (invalidZipCodePattern.test(searchTerm)) {
  //     setError('Please enter a valid postal code.');
  //   } else if (error !== null) {
  //     setError(null);
  //   }
  // };
  const onApplyFilterClick = () => {
    if (location.length === 0) {
      inputRef.current.focus();
    }
  };
  const doSearch = event => {
    if (event) {
      event.preventDefault();
      setShowFiltersBeforeSearch(false);
    }
    let paramLocation = location;
    dispatchMapChanged({ changed: false, distance: null });

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'locationSearch',
      'gibct-form-value': location,
    });

    if (autocompleteSelection?.coords) {
      setShowFiltersBeforeSearch(false);
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
        setShowFiltersBeforeSearch(false);
        dispatchFetchSearchByLocationResults(
          location,
          distance,
          filters,
          version,
        );
      }

      if (event) {
        validateSearchTerm(location, dispatchError, error, filters, 'location');
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
      <VaModal
        modalTitle={
          search.geocodeError === 1
            ? 'We need to use your location'
            : "We couldn't locate you"
        }
        onCloseEvent={() => dispatchClearGeocodeError()}
        status="warning"
        visible={search.geocodeError > 0}
      >
        <p>
          {search.geocodeError === 1
            ? 'Please enable location sharing in your browser to use this feature.'
            : 'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.'}
        </p>
      </VaModal>
      <form onSubmit={e => doSearch(e)} className="vads-u-margin-y--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--7 medium-screen:vads-l-col--7 input-row">
            <KeywordSearch
              inputRef={inputRef}
              className="location-search"
              type="location"
              // error={error}
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
              // validateSearchTerm={validateSearchTerm}
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
        !environment.isProduction() &&
        showFiltersBeforeSearch && (
          <div>
            <FilterBeforeResults
              nameVal={location}
              searchType="location"
              onApplyFilterClick={onApplyFilterClick}
            />
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
  errorReducer: state.errorReducer,
});

const mapDispatchToProps = {
  dispatchFetchSearchByLocationResults: fetchSearchByLocationResults,
  dispatchFetchLocationAutocompleteSuggestions: fetchLocationAutocompleteSuggestions,
  dispatchFetchSearchByLocationCoords: fetchSearchByLocationCoords,
  dispatchUpdateAutocompleteLocation: updateAutocompleteLocation,
  dispatchGeolocateUser: geolocateUser,
  dispatchClearGeocodeError: clearGeocodeError,
  dispatchMapChanged: mapChanged,
  dispatchError: setError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSearchForm);
