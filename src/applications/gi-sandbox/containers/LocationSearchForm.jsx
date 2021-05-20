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

export function LocationSearchForm({
  autocomplete,
  dispatchFetchLocationAutocompleteSuggestions,
  dispatchFetchSearchByLocationCoords,
  dispatchUpdateAutocompleteLocation,
  fetchSearchByLocation,
  filters,
  preview,
  search,
}) {
  const [distance, setDistance] = useState(search.query.distance);
  const { version } = preview;

  const doSearch = () => {
    event.preventDefault();
    fetchSearchByLocation(autocomplete.location, distance, search.tab);
  };

  const handleSelection = selected => {
    dispatchFetchSearchByLocationCoords(
      autocomplete.location,
      selected.coords,
      filters,
    );
  };

  const doAutocompleteSuggestionsSearch = value => {
    dispatchFetchLocationAutocompleteSuggestions(value);
  };

  return (
    <div>
      <form onSubmit={doSearch}>
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--10">
            <KeywordSearch
              version={version}
              name="locationSearch"
              className="location-search"
              inputValue={autocomplete.location}
              onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
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
  fetchSearchByLocation: fetchSearchByLocationResults,
  dispatchFetchLocationAutocompleteSuggestions: fetchLocationAutocompleteSuggestions,
  dispatchFetchSearchByLocationCoords: fetchSearchByLocationCoords,
  dispatchUpdateAutocompleteLocation: updateAutocompleteLocation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSearchForm);
