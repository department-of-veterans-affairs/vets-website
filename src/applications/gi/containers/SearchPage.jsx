import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';
import _ from 'lodash';
import classNames from 'classnames';

import {
  clearAutocompleteSuggestions,
  fetchAutocompleteSuggestions,
  fetchSearchResults,
  institutionFilterChange,
  setPageTitle,
  toggleFilter,
  updateAutocompleteSearchTerm,
  eligibilityChange,
  showModal,
} from '../actions';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import { getScrollOptions } from '../../../platform/utilities/ui';
import SearchResult from '../components/search/SearchResult';
import VetTecSearchResult from '../components/vet-tec/VetTecSearchResult';
import InstitutionSearchForm from '../components/search/InstitutionSearchForm';
import VetTecSearchForm from '../components/vet-tec/VetTecSearchForm';
import environment from '../../../platform/utilities/environment';
import { isVetTecSelected } from '../utils/helpers';

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
  }

  updateSearchResults = () => {
    const programFilters = [
      'distanceLearning',
      'studentVeteranGroup',
      'yellowRibbonScholarship',
      'onlineOnly',
      'principlesOfExcellence',
      'eightKeysToVeteranSuccess',
      'stemOffered',
      'priorityEnrollment',
      'independentStudy',
      'vet_tec_provider',
    ];

    const query = _.pick(this.props.location.query, [
      'version',
      'page',
      'name',
      'category',
      'country',
      'state',
      'type',
      ...programFilters,
    ]);

    // Update form selections based on query.
    const institutionFilter = _.omit(query, ['page', 'name']);

    // Convert string to bool for params associated with checkboxes.
    programFilters.forEach(filterKey => {
      const filterValue = institutionFilter[filterKey];
      institutionFilter[filterKey] = filterValue === 'true';
    });

    this.props.institutionFilterChange(institutionFilter);
    this.props.fetchSearchResults(query);
  };

  handlePageSelect = page => {
    this.props.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page },
    });
  };

  handleFilterChange = (field, value) => {
    // Translate form selections to query params.
    const query = { ...this.props.location.query, [field]: value };

    // Don’t update the route if the query hasn’t changed.
    if (_.isEqual(query, this.props.location.query)) {
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
              // ***CT 116***
              if (!environment.isProduction() && isVetTecSelected(filters)) {
                return (
                  <VetTecSearchResult
                    version={this.props.location.query.version}
                    key={result.facilityCode}
                    result={result}
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

  render() {
    const { search, filters } = this.props;
    const { count } = search;

    const filtersClass = classNames(
      'filters-sidebar',
      'small-12',
      'usa-width-one-fourth',
      'medium-3',
      'columns',
      { opened: search.filterOpened },
    );

    const searchResults = this.searchResults();
    return (
      <ScrollElement name="searchPage" className="search-page">
        <div className="row">
          <div className="column">
            <h1>
              {!search.inProgress && `${(count || 0).toLocaleString()} `}
              Search Results
            </h1>
          </div>
        </div>

        {/* /CT 116 */}
        {!environment.isProduction() && isVetTecSelected(filters) ? (
          <VetTecSearchForm
            filtersClass={filtersClass}
            search={search}
            autocomplete={this.props.autocomplete}
            location={this.props.location}
            clearAutocompleteSuggestions={
              this.props.clearAutocompleteSuggestions
            }
            fetchAutocompleteSuggestions={
              this.props.fetchAutocompleteSuggestions
            }
            handleFilterChange={this.handleFilterChange}
            updateAutocompleteSearchTerm={
              this.props.updateAutocompleteSearchTerm
            }
            filters={filters}
            toggleFilter={this.props.toggleFilter}
            searchResults={searchResults}
            eligibility={this.props.eligibility}
            showModal={this.props.showModal}
            eligibilityChange={this.props.eligibilityChange}
          />
        ) : (
          <InstitutionSearchForm
            filtersClass={filtersClass}
            search={search}
            autocomplete={this.props.autocomplete}
            location={this.props.location}
            clearAutocompleteSuggestions={
              this.props.clearAutocompleteSuggestions
            }
            fetchAutocompleteSuggestions={
              this.props.fetchAutocompleteSuggestions
            }
            handleFilterChange={this.handleFilterChange}
            updateAutocompleteSearchTerm={
              this.props.updateAutocompleteSearchTerm
            }
            filters={filters}
            toggleFilter={this.props.toggleFilter}
            searchResults={searchResults}
            eligibility={this.props.eligibility}
            showModal={this.props.showModal}
            eligibilityChange={this.props.eligibilityChange}
          />
        )}
      </ScrollElement>
    );
  }
}

SearchPage.defaultProps = {};

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  filters: state.filters,
  search: state.search,
  eligibility: state.eligibility,
});

const mapDispatchToProps = {
  clearAutocompleteSuggestions,
  fetchAutocompleteSuggestions,
  fetchSearchResults,
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
