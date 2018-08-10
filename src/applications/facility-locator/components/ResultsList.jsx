import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateSearchQuery, searchWithBounds } from '../actions';
import FacilityDirectionsLink from './search-results/FacilityDirectionsLink';
import FacilityInfoBlock from './search-results/FacilityInfoBlock';
import FacilityPhoneLink from './search-results/FacilityPhoneLink';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import MobileSearchResult from './MobileSearchResult';
import Pagination from '@department-of-veterans-affairs/formation/Pagination';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ResultsList extends Component {

  handlePageSelect = (page) => {
    const { currentQuery } = this.props;

    this.props.searchWithBounds(
      currentQuery.bounds,
      currentQuery.facilityType,
      currentQuery.serviceType,
      page,
    );
  }

  renderMobileView() {
    const { currentQuery, results, pagination: { currentPage, totalPages } } = this.props;

    return (
      <div>
        <div>
          {
            results.map(r => {
              return (
                <div key={r.id} className="mobile-search-result">
                  <MobileSearchResult result={r} currentLocation={currentQuery.position}/>
                </div>
              );
            })
          }
        </div>
        <Pagination onPageSelect={this.handlePageSelect} page={currentPage} pages={totalPages}/>
      </div>
    );
  }

  render() {
    const { results, isMobile, currentQuery, pagination: { currentPage, totalPages } } = this.props;

    if (currentQuery.inProgress) {
      return (
        <div>
          <LoadingIndicator message="Loading results..."/>
        </div>
      );
    }

    if (!results || results.length < 1) {
      return (
        <div className="facility-result">
          No facilities found. Please try entering a different search term (Street, City, State or Zip) and click search to find facilities.
        </div>
      );
    }

    if (isMobile) {
      return this.renderMobileView();
    }

    return (
      <div>
        <p>Search Results near <strong>“{currentQuery.context}”</strong></p>
        <div>
          {
            results.map(r => {
              return (
                <div key={r.id} className="facility-result" id={r.id}>
                  <FacilityInfoBlock location={r} currentLocation={currentQuery.position}/>
                  <FacilityPhoneLink location={r}/>
                  <FacilityDirectionsLink location={r}/>
                </div>
              );
            })
          }
        </div>
        <Pagination onPageSelect={this.handlePageSelect} page={currentPage} pages={totalPages}/>
      </div>
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array,
  isMobile: PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSearchQuery,
    searchWithBounds,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(ResultsList);
