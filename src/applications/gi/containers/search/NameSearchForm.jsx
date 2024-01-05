import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import {
  fetchNameAutocompleteSuggestions,
  fetchSearchByNameResults,
  updateAutocompleteName,
} from '../../actions';
import KeywordSearch from '../../components/search/KeywordSearch';
import { updateUrlParams } from '../../selectors/search';
import { TABS } from '../../constants';
import { FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP } from '../../selectors/filters';
import FilterBeforeResults from './FilterBeforeResults';

export function NameSearchForm({
  autocomplete,
  dispatchFetchNameAutocompleteSuggestions,
  dispatchFetchSearchByNameResults,
  dispatchUpdateAutocompleteName,
  filters,
  preview,
  search,
  smallScreen,
}) {
  const { version } = preview;
  const [name, setName] = useState(search.query.name);
  const [showFiltersBeforeSearch, setShowFiltersBeforeSearch] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  const doSearch = value => {
    dispatchFetchSearchByNameResults(value, 1, filters, version);
    const clonedFilters = filters;
    clonedFilters.excludedSchoolTypes = FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP.filter(
      exclusion => !clonedFilters.excludedSchoolTypes.includes(exclusion),
    );

    updateUrlParams(
      history,
      search.tab,
      {
        ...search.query,
        name: value,
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
        doSearch(name || search?.query?.name);
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

  const validateSearchTerm = searchTerm => {
    const empty = searchTerm.trim() === '';
    if (empty) {
      setError('Please fill in a school, employer, or training provider.');
    } else if (
      filters.schools === false &&
      filters.excludeCautionFlags === false &&
      filters.accredited === false &&
      filters.studentVeteran === false &&
      filters.yellowRibbonScholarship === false &&
      filters.employers === false &&
      filters.vettec === false &&
      filters.preferredProvider === false &&
      filters.specialMissionHbcu === false &&
      filters.specialMissionMenonly === false &&
      filters.specialMissionWomenonly === false &&
      filters.specialMissionRelaffil === false &&
      filters.specialMissionHSI === false &&
      filters.specialMissionNANTI === false &&
      filters.specialMissionANNHI === false &&
      filters.specialMissionAANAPII === false &&
      filters.specialMissionPBI === false &&
      filters.specialMissionTRIBAL === false
    ) {
      setError('Please select at least one filter.');
    } else if (error !== null) {
      setError(null);
    }
    return !empty;
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (validateSearchTerm(name)) {
      recordEvent({
        event: 'gibct-form-change',
        'gibct-form-field': 'nameSearch',
        'gibct-form-value': name,
      });
      setShowFiltersBeforeSearch(false);
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
              className="name-search"
              error={error}
              inputValue={name}
              label="School, employer, or training provider"
              onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
              onPressEnter={e => handleSubmit(e)}
              onSelection={s => setName(s.label)}
              onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
              suggestions={[...autocomplete.nameSuggestions]}
              validateSearchTerm={validateSearchTerm}
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
        showFiltersBeforeSearch && (
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
