import React from 'react';
import { connect } from 'react-redux';
import {
  fetchNameAutocompleteSuggestions,
  fetchSearchByNameResults,
  updateAutocompleteName,
} from '../actions';
import KeywordSearch from '../components/search/KeywordSearch';

export function NameSearchForm({
  autocomplete,
  dispatchFetchNameAutocompleteSuggestions,
  dispatchFetchSearchByNameResults,
  dispatchUpdateAutocompleteName,
  filters,
  preview,
}) {
  const { version } = preview;

  const doSearch = event => {
    event.preventDefault();
    dispatchFetchSearchByNameResults(autocomplete.name, filters, version);
  };

  const doAutocompleteSuggestionsSearch = name => {
    dispatchFetchNameAutocompleteSuggestions(
      name,
      {
        category: filters.category,
      },
      version,
    );
  };

  return (
    <div>
      <form onSubmit={doSearch} className="vads-u-margin-y--0">
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--10">
            <KeywordSearch
              version={version}
              className="name-search"
              inputValue={autocomplete.name}
              onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
              onPressEnter={e => doSearch(e)}
              onSelection={selected => doSearch(selected.label)}
              onUpdateAutocompleteSearchTerm={dispatchUpdateAutocompleteName}
              placeholder="school, employer, or training provider"
              suggestions={[...autocomplete.nameSuggestions]}
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
});

const mapDispatchToProps = {
  dispatchFetchNameAutocompleteSuggestions: fetchNameAutocompleteSuggestions,
  dispatchUpdateAutocompleteName: updateAutocompleteName,
  dispatchFetchSearchByNameResults: fetchSearchByNameResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameSearchForm);
