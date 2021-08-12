import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';
import classNames from 'classnames';

import {
  clearAutocompleteSuggestions,
  fetchProgramAutocompleteSuggestions,
  fetchProgramSearchResults,
  institutionFilterChange,
  setPageTitle,
  toggleFilter,
  updateAutocompleteSearchTerm,
  eligibilityChange,
  showModal,
} from '../actions';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
import VetTecProgramSearchResult from '../components/vet-tec/VetTecProgramSearchResult';
import VetTecSearchForm from '../components/vet-tec/VetTecSearchForm';
import ServiceError from '../components/ServiceError';
import { isMobileView, useQueryParams } from '../utils/helpers';
import { renderVetTecLogo, renderSearchResultsHeader } from '../utils/render';
import { searchWithFilters } from '../utils/search';
import { useHistory, useLocation } from 'react-router-dom';

const { Element: ScrollElement, scroller } = Scroll;

function VetTecSearchPage({
  autocomplete,
  constants,
  filters,
  search,
  eligibility,
  dispatchClearAutocompleteSuggestions,
  dispatchFetchProgramAutocompleteSuggestions,
  dispatchFetchProgramSearchResults,
  dispatchInstitutionFilterChange,
  dispatchSetPageTitle,
  dispatchToggleFilter,
  dispatchUpdateAutocompleteSearchTerm,
  dispatchEligibilityChange,
  dispatchShowModal,
}) {
  const location = useLocation();
  const history = useHistory();
  const queryParams = useQueryParams();

  const getQueryFilterFields = () => {
    const booleanFilterParams = [
      'preferredProvider',
      'excludeWarnings',
      'excludeCautionFlags',
    ];

    const stringFilterParams = ['version', 'country', 'state', 'type'];

    const stringSearchParams = ['page', 'name'];

    let providerQueryVal = queryParams.get('provider') || [];

    if (typeof providerQueryVal === 'string') {
      providerQueryVal = [providerQueryVal];
    }

    const allParams = [
      ...stringSearchParams,
      ...stringFilterParams,
      ...booleanFilterParams,
    ];

    const query = { provider: providerQueryVal || [] };

    allParams.forEach(filterKey => {
      const queryVal = queryParams.get(filterKey);
      if (queryVal) {
        query[filterKey] = queryParams.get(filterKey);
      }
    });

    // Update form selections based on query.
    const institutionFilter = _.omit(query, stringSearchParams);

    // Convert string to bool for params associated with checkboxes.
    booleanFilterParams.forEach(filterKey => {
      const filterValue = institutionFilter[filterKey];
      institutionFilter[filterKey] = filterValue === 'true';
    });

    return {
      institutionFilter,
      query,
    };
  };

  const handlePageSelect = page => {
    queryParams.set('page', page);
    history.push({
      pathname: '/program-search',
      search: queryParams.toString(),
    });
  };

  const handleFilterChange = (field, value) => {
    searchWithFilters({
      search,
      field,
      value,
      clearAutocompleteSuggestions: dispatchClearAutocompleteSuggestions,
      history,
      query: queryParams.toString(),
      pathname: '/program-search',
    });
  };

  const handleProviderFilterChange = provider => {
    handleFilterChange('provider', provider.provider);
  };

  const handleAutocompleteUpdate = (value, version) => {
    if (value) {
      dispatchFetchProgramAutocompleteSuggestions(
        value,
        _.omit(search.query, 'name'),
        version,
      );
    }
  };

  let title = 'Search Results';
  const searchTerm = autocomplete.term;
  if (searchTerm) {
    title += ` - ${searchTerm}`;
  }
  useEffect(
    () => {
      dispatchSetPageTitle(title);
    },
    [title],
  );

  const queryFilterFields = getQueryFilterFields();
  useEffect(
    () => {
      if (!search.inProgress) {
        dispatchInstitutionFilterChange(queryFilterFields.institutionFilter);
        dispatchFetchProgramSearchResults(queryFilterFields.query);
      }
    },
    [!_.isEqual(search.query, queryFilterFields.query)],
  );

  useEffect(
    () => {
      if (!isMobileView()) {
        scroller.scrollTo('searchPage', getScrollOptions());
      }
    },
    [search.inProgress],
  );

  useEffect(
    () => {
      if (!search.inProgress) {
        focusElement('.search-results-count > h1');
      }
    },
    [search.results],
  );

  const buildSearchResults = () => {
    const {
      pagination: { currentPage, totalPages },
    } = search;

    const filterResultsByProvider = result =>
      filters.provider.length === 0 ||
      filters.provider.includes(result.institutionName);

    const resultsClass = classNames(
      'search-results',
      'small-12',
      'medium-9',
      'columns',
      { opened: !search.filterOpened },
    );

    // Filter button on mobile.
    const filterButton = (
      <button
        className="filter-button usa-button-secondary"
        onClick={dispatchToggleFilter}
      >
        Filter
      </button>
    );

    return search.inProgress ? (
      <div className={resultsClass}>
        {filterButton}
        <LoadingIndicator message="Loading search results..." />
      </div>
    ) : (
      <div className={resultsClass}>
        {filterButton}
        <div>
          {search.results.filter(filterResultsByProvider).map(result => (
            <VetTecProgramSearchResult
              id={`${result.facilityCode}-${result.description}`}
              key={`${result.facilityCode}-${result.description}`}
              result={result}
              constants={constants}
            />
          ))}
        </div>

        <Pagination
          onPageSelect={handlePageSelect}
          page={currentPage}
          pages={totalPages}
        />
      </div>
    );
  };

  const filtersClass = classNames(
    'filters-sidebar',
    'small-12',
    'medium-3',
    'columns',
    'mobile-vettec-logo',
    { opened: search.filterOpened },
  );

  return (
    <ScrollElement name="searchPage" className="search-page">
      {search.error ? (
        <ServiceError />
      ) : (
        <div>
          <div className="vads-u-display--block single-column-display-none  vettec-logo-container">
            {renderVetTecLogo(classNames('vettec-logo-search'))}
          </div>
          <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--flex-end vads-u-margin-top--neg3">
            <div className="vads-l-col--9 search-results-count">
              {renderSearchResultsHeader(search)}
            </div>
            <div className="vads-l-col--3">
              <div className="vads-u-display--none single-column-display-block vettec-logo-container">
                {renderVetTecLogo(classNames('vettec-logo-search'))}
              </div>
            </div>
          </div>

          <VetTecSearchForm
            filtersClass={filtersClass}
            search={search}
            autocomplete={autocomplete}
            location={location}
            clearAutocompleteSuggestions={dispatchClearAutocompleteSuggestions}
            fetchAutocompleteSuggestions={handleAutocompleteUpdate}
            handleFilterChange={handleFilterChange}
            handleProviderFilterChange={handleProviderFilterChange}
            updateAutocompleteSearchTerm={dispatchUpdateAutocompleteSearchTerm}
            filters={filters}
            toggleFilter={dispatchToggleFilter}
            searchResults={buildSearchResults()}
            eligibility={eligibility}
            showModal={dispatchShowModal}
            eligibilityChange={dispatchEligibilityChange}
          />
        </div>
      )}
    </ScrollElement>
  );
}

VetTecSearchPage.defaultProps = {};

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  constants: state.constants.constants,
  filters: state.filters,
  search: state.search,
  eligibility: state.eligibility,
});

const mapDispatchToProps = {
  dispatchClearAutocompleteSuggestions: clearAutocompleteSuggestions,
  dispatchFetchProgramAutocompleteSuggestions: fetchProgramAutocompleteSuggestions,
  dispatchFetchProgramSearchResults: fetchProgramSearchResults,
  dispatchInstitutionFilterChange: institutionFilterChange,
  dispatchSetPageTitle: setPageTitle,
  dispatchToggleFilter: toggleFilter,
  dispatchUpdateAutocompleteSearchTerm: updateAutocompleteSearchTerm,
  dispatchEligibilityChange: eligibilityChange,
  dispatchShowModal: showModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VetTecSearchPage);
