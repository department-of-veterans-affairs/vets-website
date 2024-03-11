import React, { useEffect, useState, createRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import {
  fetchNameAutocompleteSuggestions,
  fetchSearchByNameResults,
  updateAutocompleteName,
  setError,
  filterBeforeResultFlag,
} from '../../actions';
import KeywordSearch from '../../components/search/KeywordSearch';
import { updateUrlParams } from '../../selectors/search';
import { TABS } from '../../constants';
import { FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP } from '../../selectors/filters';
import FilterBeforeResults from './FilterBeforeResults';
import { validateSearchTerm } from '../../utils/helpers';

export function NameSearchForm({
  autocomplete,
  dispatchFetchNameAutocompleteSuggestions,
  dispatchFetchSearchByNameResults,
  dispatchUpdateAutocompleteName,
  dispatchError,
  filters,
  preview,
  search,
  smallScreen,
  errorReducer,
  filterBeforeResultsReducer,
  dispatchShowFiltersBeforeResult,
}) {
  const { version } = preview;
  const [name, setName] = useState(search.query.name);
  // const [showFiltersBeforeSearch, setShowFiltersBeforeSearch] = useState(true);
  const { showFiltersBeforeResult } = filterBeforeResultsReducer;
  // const [error, setError] = useState(null);
  const { error } = errorReducer;
  const history = useHistory();
  const inputRef = createRef();
  const doSearch = value => {
    const searchName = value || search.query.name;
    dispatchFetchSearchByNameResults(searchName, 1, filters, version);
    const clonedFilters = filters;
    clonedFilters.excludedSchoolTypes = FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP.filter(
      exclusion => !clonedFilters.excludedSchoolTypes.includes(exclusion),
    );

    updateUrlParams(
      history,
      search.tab,
      {
        ...search.query,
        name: searchName,
      },
      clonedFilters,
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
        // doSearch(name || search?.query?.name);
        doSearch(null);
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
  const onApplyFilterClick = () => {
    if (name.length === 0) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (validateSearchTerm(name, dispatchError, error, filters, 'name')) {
      recordEvent({
        event: 'gibct-form-change',
        'gibct-form-field': 'nameSearch',
        'gibct-form-value': name,
      });
      dispatchShowFiltersBeforeResult();
      doSearch(name);
    }
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
      <form onSubmit={handleSubmit}>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-u-flex--1 medium-screen:vads-u-width--auto">
            <KeywordSearch
              inputRef={inputRef}
              className="name-search"
              inputValue={name}
              label="School, employer, or training provider"
              onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
              onPressEnter={e => handleSubmit(e)}
              onSelection={s => setName(s.label)}
              onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
              suggestions={[...autocomplete.nameSuggestions]}
              type="name"
              // validateSearchTerm={validateSearchTerm}
              filters={filters}
              version={version}
            />
          </div>
          <div className="vads-l-col--12 medium-screen:vads-u-flex--auto medium-screen:vads-u-width--auto name-search-button-container">
            <button
              className="usa-button vads-u-margin--0 vads-u-width--full find-form-button medium-screen:vads-u-width--auto name-search-button"
              type="submit"
            >
              <i
                aria-hidden="true"
                className="fas fa-search vads-u-margin-right--0p5"
                role="presentation"
              />
              Search
            </button>
          </div>
        </div>
      </form>
      {!smallScreen &&
        !environment.isProduction() &&
        showFiltersBeforeResult && (
          <div>
            <FilterBeforeResults
              nameVal={name}
              searchType="name"
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
  preview: state.preview,
  search: state.search,
  errorReducer: state.errorReducer,
  filterBeforeResultsReducer: state.filterBeforeResultsReducer,
});

const mapDispatchToProps = {
  dispatchFetchNameAutocompleteSuggestions: fetchNameAutocompleteSuggestions,
  dispatchUpdateAutocompleteName: updateAutocompleteName,
  dispatchFetchSearchByNameResults: fetchSearchByNameResults,
  dispatchError: setError,
  dispatchShowFiltersBeforeResult: filterBeforeResultFlag,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameSearchForm);
