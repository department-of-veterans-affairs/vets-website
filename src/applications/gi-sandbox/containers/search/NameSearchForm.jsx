import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  fetchNameAutocompleteSuggestions,
  fetchSearchByNameResults,
  updateAutocompleteName,
} from '../../actions';
import KeywordSearch from '../../components/search/KeywordSearch';
import { updateUrlParams } from '../../selectors/search';
import { useHistory } from 'react-router-dom';
import { TABS } from '../../constants';

export function NameSearchForm({
  autocomplete,
  dispatchFetchNameAutocompleteSuggestions,
  dispatchFetchSearchByNameResults,
  dispatchUpdateAutocompleteName,
  filters,
  preview,
  search,
}) {
  const { version } = preview;
  const [name, setName] = useState(search.query.name);
  const history = useHistory();

  const doSearch = value => {
    dispatchFetchSearchByNameResults(value, 1, filters, version);

    updateUrlParams(
      history,
      search.tab,
      {
        ...search.query,
        name: value,
      },
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
      if (!search.loadFromUrl && filters.search && search.tab === TABS.name) {
        doSearch(search.query.name || name);
      }
    },
    [filters.search],
  );

  useEffect(
    () => {
      if (
        search.loadFromUrl &&
        search.query.name !== null &&
        search.query.name !== ''
      ) {
        doSearch(search.query.name);
      }
    },
    [search.loadFromUrl],
  );

  const handleSubmit = event => {
    event.preventDefault();
    doSearch(name);
  };

  const doAutocompleteSuggestionsSearch = value => {
    dispatchFetchNameAutocompleteSuggestions(
      value,
      {
        category: filters.category,
      },
      version,
    );
  };

  const onUpdateAutocompleteSearchTerm = value => {
    setName(value);
    dispatchUpdateAutocompleteName(value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="vads-u-margin-y--0">
        <div className="vads-l-grid-container vads-u-padding-left--0 vads-u-padding-right--0">
          <div className="vads-l-row">
            <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--9 medium-screen:vads-l-col--10 input-row">
              <KeywordSearch
                version={version}
                className="name-search"
                inputValue={name}
                onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
                onPressEnter={e => handleSubmit(e)}
                onSelection={s => setName(s.label)}
                onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
                placeholder="school, employer, or training provider"
                suggestions={[...autocomplete.nameSuggestions]}
              />
            </div>
            <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3 medium-screen:vads-l-col--2 vads-u-text-align--right input-row">
              <button type="submit" className="usa-button name-search-button">
                Search
                <i aria-hidden="true" className="fa fa-search" />
              </button>
            </div>
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
  dispatchFetchNameAutocompleteSuggestions: fetchNameAutocompleteSuggestions,
  dispatchUpdateAutocompleteName: updateAutocompleteName,
  dispatchFetchSearchByNameResults: fetchSearchByNameResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameSearchForm);
