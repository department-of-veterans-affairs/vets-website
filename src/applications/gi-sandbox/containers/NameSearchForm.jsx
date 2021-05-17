import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  clearAutocompleteSuggestions,
  fetchNameAutocompleteSuggestions,
  fetchSearchByNameResults,
  updateAutocompleteSearchTerm,
} from '../actions';
import KeywordSearch from '../components/search/KeywordSearch';

export function NameSearchForm({
  autocomplete,
  clearNameAutocompleteSuggestions,
  fetchNameAutocomplete,
  filters,
  fetchSearchByName,
  preview,
  updateNameAutocomplete,
  search,
}) {
  const [searchError, setSearchError] = useState(false);
  const { version } = preview;

  const doSearch = () => {
    fetchSearchByName(
      autocomplete.searchTerm,
      {
        category: filters.category,
      },
      version,
      search.tab,
    );
  };

  const handleSubmit = event => {
    event.preventDefault();
    doSearch();
  };

  const validateSearchQuery = searchQuery => {
    setSearchError(searchQuery === '');
  };

  const doAutocompleteSuggestionsSearch = value => {
    fetchNameAutocomplete(
      value,
      {
        category: filters.category,
      },
      version,
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--10">
            <KeywordSearch
              version={version}
              className="name-search"
              placeholder="school, employer, or training provider"
              autocomplete={autocomplete}
              onClearAutocompleteSuggestions={clearNameAutocompleteSuggestions}
              onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
              onSelection={doSearch}
              onUpdateAutocompleteSearchTerm={updateNameAutocomplete}
              searchError={searchError}
              validateSearchQuery={validateSearchQuery}
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
  preview: state.preview,
  search: state.search,
});

const mapDispatchToProps = {
  clearNameAutocompleteSuggestions: clearAutocompleteSuggestions,
  fetchNameAutocomplete: fetchNameAutocompleteSuggestions,
  fetchSearchByName: fetchSearchByNameResults,
  updateNameAutocomplete: updateAutocompleteSearchTerm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameSearchForm);
