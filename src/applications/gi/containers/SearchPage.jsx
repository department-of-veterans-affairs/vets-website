import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
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
} from '../actions';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
import SearchResult from '../components/search/SearchResult';
import VetTecSearchResult from '../components/vet-tec/VetTecSearchResult';
import VetTecProgramSearchResult from '../components/vet-tec/VetTecProgramSearchResult';
import InstitutionSearchForm from '../components/search/InstitutionSearchForm';
import VetTecSearchForm from '../components/vet-tec/VetTecSearchForm';
import { isVetTecSelected } from '../utils/helpers';
import { renderVetTecLogo } from '../utils/render';
import environment from 'platform/utilities/environment';

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

    if (currentlyInProgress !== prevProps.search.inProgress) {
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
      'vetTecProvider',
      'preferredProvider',
    ];

    const stringFilterParams = [
      'version',
      'category',
      'country',
      'state',
      'type',
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

    // prod flag for story 19734
    if (!environment.isProduction() && isVetTecSelected(institutionFilter)) {
      this.props.fetchProgramSearchResults(query);
    } else {
      this.props.fetchInstitutionSearchResults(query);
    }
  };

  handlePageSelect = page => {
    this.props.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page },
    });
  };

  handleFilterChange = (field, value) => {
    // Translate form selections to query params.
    const query = {
      ...this.props.location.query,
      [field]: value,
      name: this.props.autocomplete.searchTerm,
    };

    // Don’t update the route if the query hasn’t changed.
    if (
      _.isEqual(query, this.props.location.query) ||
      this.props.search.inProgress
    ) {
      return;
    }

    // Reset to the first page upon a filter change.
    delete query.page;

    const shouldRemoveFilter =
      !value ||
      ((field === 'country' || field === 'state' || field === 'type') &&
        value === 'ALL');

    if (shouldRemoveFilter) {
      delete query[field];
    }
    this.props.router.push({ ...this.props.location, query });
  };

  searchResults = () => {
    const { search, filters } = this.props;
    const {
      pagination: { currentPage, totalPages },
    } = search;

    const resultsClass = classNames(
      'search-results',
      'small-12',
      'usa-width-three-fourths medium-9',
      'columns',
      { opened: !search.filterOpened },
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
            {search.results.map(result => {
              if (isVetTecSelected(filters)) {
                // prod flag for story 19734
                if (environment.isProduction()) {
                  return (
                    <VetTecSearchResult
                      version={this.props.location.query.version}
                      key={result.facilityCode}
                      result={result}
                    />
                  );
                }
                return (
                  <VetTecProgramSearchResult
                    version={this.props.location.query.version}
                    key={`${result.facilityCode}-${result.description}`}
                    result={result}
                    constants={this.props.constants}
                  />
                );
              }
              return (
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
                  studentCount={result.studentCount}
                  bah={result.bah}
                  dodBah={result.dodBah}
                  schoolClosing={result.schoolClosing}
                  tuitionInState={result.tuitionInState}
                  tuitionOutOfState={result.tuitionOutOfState}
                  books={result.books}
                  studentVeteran={result.studentVeteran}
                  yr={result.yr}
                  poe={result.poe}
                  eightKeys={result.eightKeys}
                />
              );
            })}
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

  renderSearchResultsHeader = search => (
    <h1 tabIndex={-1}>
      {!search.inProgress &&
        `${(search.count || 0).toLocaleString()} Search Results`}
    </h1>
  );

  renderVetTecSearchForm = (searchResults, filtersClass) => (
    <div>
      <div className="vads-u-display--block small-screen:vads-u-display--none vettec-logo-container">
        {renderVetTecLogo(classNames('vettec-logo'))}
      </div>
      <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--flex-end">
        <div className="vads-l-col--10 search-results-count">
          {this.renderSearchResultsHeader(this.props.search)}
        </div>
        <div className="vads-l-col--2">
          <div className="vads-u-display--none small-screen:vads-u-display--block vettec-logo-container">
            {renderVetTecLogo(classNames('vettec-logo'))}
          </div>
        </div>
      </div>
      <VetTecSearchForm
        filtersClass={filtersClass}
        search={this.props.search}
        autocomplete={this.props.autocomplete}
        location={this.props.location}
        clearAutocompleteSuggestions={this.props.clearAutocompleteSuggestions}
        fetchAutocompleteSuggestions={
          this.props.fetchProgramAutocompleteSuggestions
        }
        handleFilterChange={this.handleFilterChange}
        updateAutocompleteSearchTerm={this.props.updateAutocompleteSearchTerm}
        filters={this.props.filters}
        toggleFilter={this.props.toggleFilter}
        searchResults={searchResults}
        eligibility={this.props.eligibility}
        showModal={this.props.showModal}
        eligibilityChange={this.props.eligibilityChange}
      />
    </div>
  );

  renderInstitutionSearchForm = (searchResults, filtersClass) => (
    <div>
      <div className="vads-l-col--10 search-results-count">
        {this.renderSearchResultsHeader(this.props.search)}
      </div>
      <InstitutionSearchForm
        filtersClass={filtersClass}
        search={this.props.search}
        autocomplete={this.props.autocomplete}
        location={this.props.location}
        clearAutocompleteSuggestions={this.props.clearAutocompleteSuggestions}
        fetchAutocompleteSuggestions={
          this.props.fetchInstitutionAutocompleteSuggestions
        }
        handleFilterChange={this.handleFilterChange}
        updateAutocompleteSearchTerm={this.props.updateAutocompleteSearchTerm}
        filters={this.props.filters}
        toggleFilter={this.props.toggleFilter}
        searchResults={searchResults}
        eligibility={this.props.eligibility}
        showModal={this.props.showModal}
        eligibilityChange={this.props.eligibilityChange}
      />
    </div>
  );

  render() {
    const { search, filters } = this.props;

    const filtersClass = classNames(
      'filters-sidebar',
      'small-12',
      'usa-width-one-fourth',
      'medium-3',
      'columns',
      'mobile-vettec-logo',
      { opened: search.filterOpened },
    );

    const searchResults = this.searchResults();

    return (
      <ScrollElement name="searchPage" className="search-page">
        {/* /CT 116 */}
        {isVetTecSelected(filters)
          ? this.renderVetTecSearchForm(searchResults, filtersClass)
          : this.renderInstitutionSearchForm(searchResults, filtersClass)}
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
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SearchPage),
);
