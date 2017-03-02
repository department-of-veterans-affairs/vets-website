import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';

import {
  setPageTitle,
  fetchSearchResults,
  institutionFilterChange
} from '../actions';

import KeywordSearch from '../components/search/KeywordSearch';
import EligibilityForm from '../components/search/EligibilityForm';
import InstitutionFilterForm from '../components/search/InstitutionFilterForm';
import SearchResult from '../components/search/SearchResult';
import Pagination from '../../common/components/Pagination';

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
    if (!_.isEqual(this.props.location, prevProps.location)) {
      this.updateSearchResults();
    }
  }

  updateSearchResults() {
    const query = _.pick(this.props.location.query, [
      'page',
      'name',
      'type',
      'country',
      'state',
      'caution',
      'studentVeteranGroup',
      'yellowRibbonScholarship',
      'principlesOfExcellence',
      'eightKeysToVeteranSuccess',
      'typeName'
    ]);

    this.props.fetchSearchResults(query);
  }

  handlePageSelect(page) {
    this.props.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page }
    });
  }

  handleFilterChange(field, value) {
    this.props.institutionFilterChange(field, value);

    // Translate form selections to query params.
    const queryKey = field === 'type' ? 'typeName' : field;
    const queryValue = field === 'caution' ? !value : value;
    const query = { ...this.props.location.query, [queryKey]: queryValue };

    const shouldRemoveFilter =
      (queryKey !== 'caution' && !queryValue) ||
      (queryKey === 'caution' && queryValue) ||
      ((queryKey === 'country' ||
        queryKey === 'state' ||
        queryKey === 'typeName') && queryValue === 'ALL');

    if (shouldRemoveFilter) { delete query[queryKey]; }
    this.props.router.push({ ...this.props.location, query });
  }

  render() {
    const count = this.props.search.count;
    const { currentPage, totalPages } = this.props.search.pagination;
    return (
      <div className="search-page">

        <div className="row">
          <div className="column">
            <h1>{count ? count.toLocaleString() : null} Search Results</h1>
          </div>
        </div>

        <div className="row">
          <div className="filters-sidebar small-12 medium-3 columns">
            <h2>Keywords</h2>
            <KeywordSearch label="City, school, or employer"/>
            <InstitutionFilterForm
                search={this.props.search}
                filters={this.props.filters}
                onFilterChange={this.handleFilterChange}/>
            <EligibilityForm/>
          </div>

          <div className="small-12 medium-9 columns">
            <div className="search-results">
              {this.props.search.results.map((result) => {
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
        </div>

      </div>
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
