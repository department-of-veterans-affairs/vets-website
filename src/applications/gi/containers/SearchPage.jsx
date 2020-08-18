import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';
import classNames from 'classnames';

import {
  clearAutocompleteSuggestions,
  fetchInstitutionAutocompleteSuggestions,
  fetchInstitutionSearchResults,
  fetchProgramAutocompleteSuggestions,
  fetchProgramSearchResults,
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

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
import SearchResult from '../components/search/SearchResult';
import InstitutionSearchForm from '../components/search/InstitutionSearchForm';
import ServiceError from '../components/ServiceError';
import { renderSearchResultsHeader } from '../utils/render';
import environment from 'platform/utilities/environment';
import { isMobileView } from '../utils/helpers';
import { searchWithFilters } from '../utils/search';

const { Element: ScrollElement, scroller } = Scroll;

export class SearchPage extends React.Component {
  componentDidMount() {
    let title = 'Search Results';
    const searchTerm = this.props.autocomplete.term;
    if (searchTerm) {
      title += ` - ${searchTerm}`;
    }
    this.props.setPageTitle(title);
    this.updateSearchResults();
  }

  componentDidUpdate(prevProps) {
    const currentlyInProgress = this.props.search.inProgress;

    const shouldUpdateSearchResults =
      !currentlyInProgress &&
      !_.isEqual(this.props.location.query, prevProps.location.query);

    if (shouldUpdateSearchResults) {
      this.updateSearchResults();
    }

    // prod flag for bah-8821
    if (environment.isProduction()) {
      if (currentlyInProgress !== prevProps.search.inProgress) {
        scroller.scrollTo('searchPage', getScrollOptions());
      }
    } else if (
      !isMobileView() &&
      currentlyInProgress !== prevProps.search.inProgress
    ) {
      scroller.scrollTo('searchPage', getScrollOptions());
    }

    if (
      !currentlyInProgress &&
      !_.isEqual(this.props.search.results, prevProps.search.results)
    ) {
      focusElement('.search-results-count > h1');
    }
  }

  updateSearchResults = () => {
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
      'womenonly',
      'menonly',
      'hbcu',
    ];

    const stringFilterParams = [
      'version',
      'category',
      'country',
      'state',
      'type',
      'relaffil',
    ];

    const stringSearchParams = ['page', 'name'];

    const query = _.pick(this.props.location.query, [
      ...stringSearchParams,
      ...stringFilterParams,
      ...booleanFilterParams,
    ]);

    // Update form selections based on query.
    const institutionFilter = _.omit(query, stringSearchParams);

    // Convert string to bool for params associated with checkboxes.
    booleanFilterParams.forEach(filterKey => {
      const filterValue = institutionFilter[filterKey];
      institutionFilter[filterKey] = filterValue === 'true';
    });

    this.props.institutionFilterChange(institutionFilter);
    this.props.fetchInstitutionSearchResults(
      query,
      this.props.gibctSearchEnhancements,
    );
  };

  autocomplete = (value, version) => {
    if (value) {
      this.props.fetchInstitutionAutocompleteSuggestions(
        value,
        _.omit(this.props.search.query, 'name'),
        version,
      );
    }
  };

  handlePageSelect = page => {
    this.props.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page },
    });
  };

  handleFilterChange = (field, value, additionalFields = []) => {
    const removedWhenAllFields = ['country', 'state', 'type', 'relaffil'];
    additionalFields.push({ field, value });
    searchWithFilters(this.props, additionalFields, removedWhenAllFields);
  };

  searchResults = () => {
    const { search } = this.props;
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

    let searchResults;

    // Filter button on mobile.
    const filterButton = (
      <button
        className="filter-button usa-button-secondary"
        onClick={this.props.toggleFilter}
      >
        Filter
      </button>
    );

    if (search.inProgress) {
      searchResults = (
        <div className={resultsClass}>
          {filterButton}
          <LoadingIndicator message="Loading search results..." />
        </div>
      );
    } else {
      searchResults = (
        <div className={resultsClass}>
          {filterButton}
          <div>
            {search.results.map(result => (
              <SearchResult
                version={this.props.location.query.version}
                key={result.facilityCode}
                name={result.name}
                facilityCode={result.facilityCode}
                type={result.type}
                city={result.city}
                state={result.state}
                zip={result.zip}
                country={result.country}
                cautionFlag={result.cautionFlag}
                cautionFlags={result.cautionFlags}
                studentCount={result.studentCount}
                bah={result.bah}
                dodBah={result.dodBah}
                schoolClosing={result.schoolClosing}
                schoolClosingOn={result.schoolClosingOn}
                tuitionInState={result.tuitionInState}
                tuitionOutOfState={result.tuitionOutOfState}
                books={result.books}
                studentVeteran={result.studentVeteran}
                yr={result.yr}
                poe={result.poe}
                eightKeys={result.eightKeys}
                womenonly={result.womenonly}
                menonly={result.menonly}
                relaffil={result.relaffil}
                hbcu={result.hbcu}
              />
            ))}
          </div>

          <Pagination
            onPageSelect={this.handlePageSelect.bind(this)}
            page={currentPage}
            pages={totalPages}
          />
        </div>
      );
    }

    return searchResults;
  };

  renderInstitutionSearchForm = (searchResults, filtersClass) => (
    <div>
      <div className="vads-l-col--10 search-results-count">
        {renderSearchResultsHeader(this.props.search)}
      </div>
      <InstitutionSearchForm
        filtersClass={filtersClass}
        search={this.props.search}
        autocomplete={this.props.autocomplete}
        location={this.props.location}
        clearAutocompleteSuggestions={this.props.clearAutocompleteSuggestions}
        fetchAutocompleteSuggestions={this.autocomplete}
        handleFilterChange={this.handleFilterChange}
        updateAutocompleteSearchTerm={this.props.updateAutocompleteSearchTerm}
        filters={this.props.filters}
        toggleFilter={this.props.toggleFilter}
        searchResults={searchResults}
        eligibility={this.props.eligibility}
        showModal={this.props.showModal}
        eligibilityChange={this.props.eligibilityChange}
        hideModal={this.props.hideModal}
        gibctFilterEnhancement={this.props.gibctFilterEnhancement}
        gibctCh33BenefitRateUpdate={this.props.gibctCh33BenefitRateUpdate}
      />
    </div>
  );

  render() {
    const { search } = this.props;

    const filtersClass = classNames(
      'filters-sidebar',
      'small-12',
      'medium-3',
      'columns',
      { opened: search.filterOpened },
    );

    const searchResults = this.searchResults();

    return (
      <ScrollElement name="searchPage" className="search-page">
        {/* /CT 116 */}
        {search.error ? (
          <ServiceError />
        ) : (
          this.renderInstitutionSearchForm(searchResults, filtersClass)
        )}
      </ScrollElement>
    );
  }
}

SearchPage.defaultProps = {};

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  constants: state.constants.constants,
  filters: state.filters,
  search: state.search,
  eligibility: state.eligibility,
  gibctSearchEnhancements: toggleValues(state)[
    FEATURE_FLAG_NAMES.gibctSearchEnhancements
  ],
  gibctFilterEnhancement: toggleValues(state)[
    FEATURE_FLAG_NAMES.gibctFilterEnhancement
  ],
  gibctCh33BenefitRateUpdate: toggleValues(state)[
    FEATURE_FLAG_NAMES.gibctCh33BenefitRateUpdate
  ],
});

const mapDispatchToProps = {
  clearAutocompleteSuggestions,
  fetchProgramAutocompleteSuggestions,
  fetchInstitutionAutocompleteSuggestions,
  fetchInstitutionSearchResults,
  fetchProgramSearchResults,
  institutionFilterChange,
  setPageTitle,
  toggleFilter,
  updateAutocompleteSearchTerm,
  eligibilityChange,
  showModal,
  hideModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
