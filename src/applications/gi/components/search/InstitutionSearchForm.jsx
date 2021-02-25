import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import InstitutionFilterForm from './InstitutionFilterForm';
import KeywordSearch from './KeywordSearch';
import OnlineClassesFilter from './OnlineClassesFilter';
import BenefitsForm from '../profile/BenefitsForm';
import {
  handleInputFocusWithPotentialOverLap,
  isVetTecSelected,
  useQueryParams,
} from '../../utils/helpers';

function InstitutionSearchForm({
  autocomplete,
  clearAutocompleteSuggestions,
  eligibility,
  eligibilityChange,
  fetchAutocompleteSuggestions,
  filters,
  filtersClass,
  handleFilterChange,
  hideModal,
  location,
  search,
  searchResults,
  showModal,
  toggleFilter,
  updateAutocompleteSearchTerm,
}) {
  function handleInstitutionSearchInputFocus(fieldId) {
    const seeResultsButtonFieldId = 'see-results-button';
    const scrollableFieldId = 'institution-search';
    handleInputFocusWithPotentialOverLap(
      fieldId,
      seeResultsButtonFieldId,
      scrollableFieldId,
    );
  }

  const queryParams = useQueryParams();
  const history = useHistory();
  const [searchError, setSearchError] = useState(false);

  const searching = value => {
    for (const key of queryParams.keys()) {
      const val = queryParams.get(key);
      if (typeof val !== 'boolean' && (!val || val === 'ALL')) {
        queryParams.delete(key);
      }
    }
    queryParams.set('category', filters.category);
    queryParams.set('name', value);

    history.push({ pathname: 'search', search: queryParams.toString() });
  };
  const doSearch = value => {
    // Only search upon blur, keyUp, suggestion selection
    // if the search term is not empty.
    setSearchError(!(isVetTecSelected(filters) || value));

    searching(value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    doSearch(autocomplete.searchTerm);
  };

  const keywordSearchLabel = 'Enter a school, employer name, city, or zip code';

  return (
    <div className="row">
      <div id="institution-search" className={filtersClass}>
        <div className="filters-sidebar-inner vads-u-margin-left--1p5">
          {search.filterOpened && (
            <div className="search-filter-text">
              <h1>Filter your search</h1>
            </div>
          )}

          <h2 className="vads-u-font-size--h3">Search by keyword</h2>

          <div>
            <form id="search-page-form" onSubmit={handleSubmit}>
              <KeywordSearch
                searchOnAutcompleteSelection
                autocomplete={autocomplete}
                label={keywordSearchLabel}
                location={location}
                onClearAutocompleteSuggestions={clearAutocompleteSuggestions}
                onFetchAutocompleteSuggestions={fetchAutocompleteSuggestions}
                onFilterChange={handleFilterChange}
                onUpdateAutocompleteSearchTerm={updateAutocompleteSearchTerm}
                searchError={searchError}
              />
              <div className="search-button-mobile">
                <button
                  className="search-button"
                  type="submit"
                  id="search-button"
                  onClick={toggleFilter}
                >
                  <span>Search</span>
                </button>
              </div>
              <div className="vads-u-margin-top--2">
                <h2 className="vads-u-font-size--h3">Refine search</h2>
                <p>Make changes below to update your results:</p>
              </div>

              <InstitutionFilterForm
                search={search}
                filters={filters}
                handleFilterChange={handleFilterChange}
                showModal={showModal}
                handleInputFocus={handleInstitutionSearchInputFocus}
              />
              <BenefitsForm
                eligibilityChange={eligibilityChange}
                {...eligibility}
                hideModal={hideModal}
                showModal={showModal}
                showHeader
                handleInputFocus={handleInstitutionSearchInputFocus}
              />
              <OnlineClassesFilter
                onlineClasses={eligibility.onlineClasses}
                onChange={eligibilityChange}
                showModal={showModal}
                handleInputFocus={handleInstitutionSearchInputFocus}
              />
            </form>
          </div>
        </div>
        <div id="see-results-button" className="results-button">
          <button
            className="usa-button-secondary"
            data-cy="see-results"
            onClick={toggleFilter}
          >
            See Results ({search.count})
          </button>
        </div>
      </div>
      {searchResults}
    </div>
  );
}

export default InstitutionSearchForm;
