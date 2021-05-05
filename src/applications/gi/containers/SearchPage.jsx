import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';

import {
  clearAutocompleteSuggestions,
  fetchInstitutionAutocompleteSuggestions,
  fetchInstitutionSearchResults,
  institutionFilterChange,
  setPageTitle,
  toggleFilter,
  updateAutocompleteSearchTerm,
  eligibilityChange,
  showModal,
  hideModal,
} from '../actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
import SearchResult from '../components/search/SearchResult';
import RatedSearchResult from '../components/search/RatedSearchResult';
import InstitutionSearchForm from '../components/search/InstitutionSearchForm';
import ServiceError from '../components/ServiceError';
import { renderSearchResultsHeader } from '../utils/render';
import { isMobileView, useQueryParams } from '../utils/helpers';
import { searchWithFilters } from '../utils/search';

const { Element: ScrollElement, scroller } = Scroll;

export function SearchPage({
  autocomplete,
  dispatchClearAutocompleteSuggestions,
  dispatchEligibilityChange,
  dispatchFetchInstitutionAutocompleteSuggestions,
  dispatchFetchInstitutionSearchResults,
  dispatchHideModal,
  dispatchInstitutionFilterChange,
  dispatchSetPageTitle,
  dispatchShowModal,
  dispatchToggleFilter,
  dispatchUpdateAutocompleteSearchTerm,
  eligibility,
  filters,
  gibctSchoolRatings,
  search,
}) {
  const location = useLocation();
  const history = useHistory();
  const queryParams = useQueryParams();

  const searchTerm = autocomplete.term;
  const title = searchTerm ? `SearchResults - ${searchTerm}` : 'Search Results';

  useEffect(
    () => {
      dispatchSetPageTitle(title);
    },
    [title],
  );

  useEffect(
    () => {
      if (!search.inProgress) {
        const booleanFilterParams = [
          'distanceLearning',
          'studentVeteranGroup',
          'yellowRibbonScholarship',
          'onlineOnly',
          'principlesOfExcellence',
          'eightKeysToVeteranSuccess',
          'stemIndicator',
          'priorityEnrollment',
          'independentStudy',
          'preferredProvider',
          'excludeWarnings',
          'excludeCautionFlags',
        ];

        const stringFilterParams = [
          'version',
          'category',
          'country',
          'state',
          'type',
        ];

        const stringSearchParams = ['page', 'name'];

        const allParams = [
          ...stringSearchParams,
          ...stringFilterParams,
          ...booleanFilterParams,
        ];

        const query = {};
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

        dispatchInstitutionFilterChange(institutionFilter);

        dispatchFetchInstitutionSearchResults(query);
      }
    },
    [location.search],
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

  const handleAutocompleteUpdate = (value, version) => {
    if (value) {
      dispatchFetchInstitutionAutocompleteSuggestions(
        value,
        _.omit(search.query, 'name'),
        version,
      );
    }
  };

  const handlePageSelect = page => {
    queryParams.set('page', page);
    history.push({ pathname: '/search/', search: queryParams.toString() });
  };

  const handleFilterChange = (field, value) => {
    searchWithFilters({
      search,
      field,
      value,
      clearAutocompleteSuggestions: dispatchClearAutocompleteSuggestions,
      history,
      query: queryParams.toString(),
      pathname: '/search',
    });
  };

  const searchResults = () => {
    const {
      pagination: { currentPage, totalPages },
    } = search;

    const resultsClass = classNames(
      'search-results',
      'small-12',
      'medium-9',
      'columns',
      {
        opened: !search.filterOpened,
      },
    );

    let results;

    // Filter button on mobile.
    const filterButton = (
      <button
        className="filter-button usa-button-secondary"
        data-cy="filter-button"
        onClick={dispatchToggleFilter}
      >
        Filter
      </button>
    );

    if (search.inProgress) {
      results = (
        <div className={resultsClass}>
          {filterButton}
          <LoadingIndicator message="Loading search results..." />
        </div>
      );
    } else {
      results = (
        <div className={resultsClass}>
          {filterButton}
          <div>
            {search.results.map(result => {
              return gibctSchoolRatings ? (
                <RatedSearchResult
                  key={result.facilityCode}
                  menOnly={result.menonly}
                  womenOnly={result.womenonly}
                  ratingAverage={result.ratingAverage}
                  ratingCount={result.ratingCount}
                  {...result}
                />
              ) : (
                <SearchResult
                  key={result.facilityCode}
                  menOnly={result.menonly}
                  womenOnly={result.womenonly}
                  {...result}
                />
              );
            })}
          </div>

          <Pagination
            onPageSelect={handlePageSelect}
            page={currentPage}
            pages={totalPages}
          />
        </div>
      );
    }

    return results;
  };

  const renderInstitutionSearchForm = () => {
    const filtersClass = classNames(
      'filters-sidebar',
      'small-12',
      'medium-3',
      'columns',
      { opened: search.filterOpened },
    );
    return (
      <div>
        <div className="vads-l-col--10 search-results-count">
          {renderSearchResultsHeader(search)}
        </div>
        <InstitutionSearchForm
          filtersClass={filtersClass}
          search={search}
          autocomplete={autocomplete}
          location={location}
          clearAutocompleteSuggestions={dispatchClearAutocompleteSuggestions}
          fetchAutocompleteSuggestions={handleAutocompleteUpdate}
          handleFilterChange={handleFilterChange}
          updateAutocompleteSearchTerm={dispatchUpdateAutocompleteSearchTerm}
          filters={filters}
          toggleFilter={dispatchToggleFilter}
          searchResults={searchResults()}
          eligibility={eligibility}
          showModal={dispatchShowModal}
          eligibilityChange={dispatchEligibilityChange}
          hideModal={dispatchHideModal}
          searchOnAutcompleteSelection
        />
      </div>
    );
  };

  return (
    <ScrollElement name="searchPage" className="search-page">
      {/* /CT 116 */}
      {search.error ? <ServiceError /> : renderInstitutionSearchForm()}
    </ScrollElement>
  );
}

SearchPage.defaultProps = {};

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  constants: state.constants.constants,
  filters: state.filters,
  search: state.search,
  eligibility: state.eligibility,
  gibctSchoolRatings: toggleValues(state)[
    FEATURE_FLAG_NAMES.gibctSchoolRatings
  ],
});

const mapDispatchToProps = {
  dispatchClearAutocompleteSuggestions: clearAutocompleteSuggestions,
  dispatchFetchInstitutionAutocompleteSuggestions: fetchInstitutionAutocompleteSuggestions,
  dispatchFetchInstitutionSearchResults: fetchInstitutionSearchResults,
  dispatchInstitutionFilterChange: institutionFilterChange,
  dispatchSetPageTitle: setPageTitle,
  dispatchToggleFilter: toggleFilter,
  dispatchUpdateAutocompleteSearchTerm: updateAutocompleteSearchTerm,
  dispatchEligibilityChange: eligibilityChange,
  dispatchShowModal: showModal,
  dispatchHideModal: hideModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
