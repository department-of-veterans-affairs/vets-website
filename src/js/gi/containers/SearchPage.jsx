import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';
import _ from 'lodash';

import {
  setPageTitle,
  fetchSearchResults,
  institutionFilterChange
} from '../actions';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import Pagination from '../../common/components/Pagination';
import { getScrollOptions } from '../../common/utils/helpers';
import KeywordSearch from '../components/search/KeywordSearch';
import EligibilityForm from '../components/search/EligibilityForm';
import InstitutionFilterForm from '../components/search/InstitutionFilterForm';
import SearchResult from '../components/search/SearchResult';

const { Element: ScrollElement, scroller } = Scroll;

export class SearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
  }

  componentDidMount() {
    let title = 'Search Results';
    const searchTerm = this.props.autocomplete.term;
    if (searchTerm) { title += ` - ${searchTerm}`; }
    this.props.setPageTitle(title);
    this.updateSearchResults();
  }

  componentDidUpdate(prevProps) {
    const currentlyInProgress = this.props.search.inProgress;

    const shouldUpdateSearchResults =
      !currentlyInProgress &&
      !_.isEqual(
        this.props.location.query,
        prevProps.location.query
      );

    if (shouldUpdateSearchResults) {
      this.updateSearchResults();
    }

    if (currentlyInProgress !== prevProps.search.inProgress) {
      scroller.scrollTo('searchPage', getScrollOptions());
    }
  }

  updateSearchResults() {
    const programFilters = [
      'caution',
      'studentVeteranGroup',
      'yellowRibbonScholarship',
      'principlesOfExcellence',
      'eightKeysToVeteranSuccess'
    ];

    const query = _.pick(this.props.location.query, [
      'page',
      'name',
      'category',
      'country',
      'state',
      'type',
      ...programFilters
    ]);

    // Update form selections based on query.
    const institutionFilter = _.omit(query, ['page', 'name']);

    // Convert string to bool for params associated with checkboxes.
    programFilters.forEach(filterKey => {
      const filterValue = institutionFilter[filterKey];
      institutionFilter[filterKey] =
        filterValue === 'true' ||
        (filterKey === 'caution' && filterValue === 'false');
    });

    this.props.institutionFilterChange(institutionFilter);
    this.props.fetchSearchResults(query);
  }

  handlePageSelect(page) {
    this.props.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page }
    });
  }

  handleFilterChange(field, value) {
    // Translate form selections to query params.
    const queryValue = field === 'caution' ? !value : value;
    const query = { ...this.props.location.query, [field]: queryValue };

    const shouldRemoveFilter =
      (field !== 'caution' && !queryValue) ||
      (field === 'caution' && queryValue) ||
      ((field === 'category' ||
        field === 'country' ||
        field === 'state' ||
        field === 'type') && queryValue === 'ALL');

    if (shouldRemoveFilter) { delete query[field]; }
    this.props.router.push({ ...this.props.location, query });
  }

  render() {
    const { search, filters } = this.props;
    const { count, pagination: { currentPage, totalPages } } = search;
    let searchResults;

    if (search.inProgress) {
      searchResults = (
        <div className="small-12 medium-9 columns">
          <LoadingIndicator message="Loading search results..."/>;
        </div>
      );
    } else {
      searchResults = (
        <div className="small-12 medium-9 columns">
          <div className="search-results">
            {search.results.map((result) => {
              return (
                <SearchResult
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
                    tuitionInState={result.tuitionInState}
                    tuitionOutOfState={result.tuitionOutOfState}
                    books={result.books}
                    studentVeteran={result.studentVeteran}
                    yr={result.yr}
                    poe={result.poe}
                    eightKeys={result.eightKeys}/>
              );
            })}
          </div>

          <Pagination
              onPageSelect={this.handlePageSelect.bind(this)}
              page={currentPage}
              pages={totalPages}/>
        </div>
      );
    }

    return (
      <ScrollElement name="searchPage" className="search-page">

        <div className="row">
          <div className="column">
            <h1>{count ? count.toLocaleString() : null} Search Results</h1>
          </div>
        </div>

        <div className="row">
          <div className="filters-sidebar small-12 medium-3 columns">
            <h2>Keywords</h2>
            <KeywordSearch
                location={this.props.location}
                label="City, school, or employer"
                onFilterChange={this.handleFilterChange}/>
            <InstitutionFilterForm
                search={search}
                filters={filters}
                onFilterChange={this.handleFilterChange}/>
            <EligibilityForm/>
          </div>
          {searchResults}
        </div>

      </ScrollElement>
    );
  }

}

SearchPage.defaultProps = {};

const mapStateToProps = (state) => {
  const { autocomplete, filters, search } = state;
  return { autocomplete, filters, search };
};

const mapDispatchToProps = {
  setPageTitle,
  fetchSearchResults,
  institutionFilterChange
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
