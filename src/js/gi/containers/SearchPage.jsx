import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import KeywordSearch from '../components/search/KeywordSearch';
import EligibilityForm from '../components/search/EligibilityForm';
import InstitutionFilterForm from '../components/search/InstitutionFilterForm';
import SearchResult from '../components/search/SearchResult';
import Pagination from '../../common/components/Pagination';

export class SearchPage extends React.Component {

  componentWillMount() {
    this.props.fetch();
  }

  handlePageSelect(page) {
    this.props.fetch(page);
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
            <InstitutionFilterForm/>
            <EligibilityForm/>
          </div>

          <div className="small-12 medium-9 columns">
            <div className="search-results">
              {this.props.search.results.map(function (result) {
                return (
                  <SearchResult
                      key={result.facility_code}
                      name={result.name}
                      facilityCode={result.facility_code}
                      type={result.type}
                      city={result.city}
                      state={result.state}
                      zip={result.zip}
                      country={result.country}
                      cautionFlag={result.caution_flag}
                      studentCount={result.student_count}
                      bah={result.bah}
                      tuitionInState={result.tuition_in_state}
                      tuitionOutOfState={result.tuitionOutOfState}
                      books={result.books}
                      studentVeteran={result.student_veteran}
                      yr={result.yr}
                      poe={result.poe}
                      eightKeys={result.eight_keys}/>
                );
              })}
            </div>

            <Pagination onPageSelect={this.handlePageSelect.bind(this)} page={currentPage} pages={totalPages}/>
          </div>
        </div>

      </div>
    );
  }

  componentDidMount() {
    let title = 'Search Results';
    const search_term = this.props.autocomplete.term;
    if (search_term) { title += ` - ${search_term}`; }
    this.props.setPageTitle(title);
  }
}

SearchPage.defaultProps = {};

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (name) => {
      dispatch(actions.displayModal(name));
    },
    hideModal: () => {
      dispatch(actions.displayModal(null));
    },
    setPageTitle: (title) => {
      dispatch(actions.setPageTitle(title));
    },
    fetch: (page) => {
      dispatch(actions.fetchSearchResults(page));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
