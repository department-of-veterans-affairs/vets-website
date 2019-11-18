import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';
import _ from 'lodash';
import classNames from 'classnames';

import {
  clearAutocompleteSuggestions,
  fetchProgramAutocompleteSuggestions,
  fetchInstitutionSearchResults,
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
import VetTecProgramSearchResult from '../components/vet-tec/VetTecProgramSearchResult';
import VetTecSearchForm from '../components/vet-tec/VetTecSearchForm';
import { renderVetTecLogo } from '../utils/render';

const { Element: ScrollElement, scroller } = Scroll;

export class VetTecSearchPage extends React.Component {
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

  getQueryFilterFields = () => {
    const booleanFilterParams = ['preferredProvider'];

    const stringFilterParams = ['version', 'country', 'state', 'type'];

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

    return {
      institutionFilter,
      query,
    };
  };

  updateSearchResults = () => {
    const queryFilterFields = this.getQueryFilterFields();
    this.props.institutionFilterChange(queryFilterFields.institutionFilter);
    this.props.fetchProgramSearchResults(queryFilterFields.query);
  };

  handlePageSelect = page => {
    this.props.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page },
    });
  };

  handleProviderFilterChange = provider => {
    scroller.scrollTo('searchPage', getScrollOptions());

    this.props.institutionFilterChange({
      ...this.getQueryFilterFields().institutionFilter,
      ...provider,
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

  filterResultsByProvider = result =>
    this.props.filters.provider.length === 0 ||
    this.props.filters.provider.includes(result.institutionName);

  searchResults = () => {
    const { search } = this.props;
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
            {search.results.filter(this.filterResultsByProvider).map(result => (
              <VetTecProgramSearchResult
                version={this.props.location.query.version}
                key={`${result.facilityCode}-${result.description}`}
                result={result}
                constants={this.props.constants}
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

  renderSearchResultsHeader = search => {
    const resultCount =
      search.results.filter(this.filterResultsByProvider).length || 0;
    return (
      <h1 tabIndex={-1}>
        {!search.inProgress && `${resultCount.toLocaleString()} Search Results`}
      </h1>
    );
  };

  render() {
    const { search, filters } = this.props;

    const filtersClass = classNames(
      'filters-sidebar',
      'small-12',
      'medium-3',
      'columns',
      'mobile-vettec-logo',
      { opened: search.filterOpened },
    );

    const searchResults = this.searchResults();

    return (
      <ScrollElement name="searchPage" className="search-page">
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
            clearAutocompleteSuggestions={
              this.props.clearAutocompleteSuggestions
            }
            fetchAutocompleteSuggestions={
              this.props.fetchProgramAutocompleteSuggestions
            }
            handleFilterChange={this.handleFilterChange}
            handleProviderFilterChange={this.handleProviderFilterChange}
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
        </div>
      </ScrollElement>
    );
  }
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
  clearAutocompleteSuggestions,
  fetchProgramAutocompleteSuggestions,
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
  )(VetTecSearchPage),
);
