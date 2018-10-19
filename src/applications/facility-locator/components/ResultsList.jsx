/* eslint-disable arrow-body-style */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateSearchQuery, searchWithBounds } from '../actions';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import SearchResult from './SearchResult';
import Pagination from '@department-of-veterans-affairs/formation/Pagination';

class ResultsList extends Component {
  handlePageSelect = page => {
    const { currentQuery } = this.props;

    this.props.searchWithBounds({
      bounds: currentQuery.bounds,
      facilityType: currentQuery.facilityType,
      serviceType: currentQuery.serviceType,
      page,
    });
  };

  render() {
    const { results, isMobile, currentQuery, pagination: { currentPage, totalPages } } = this.props;

    if (currentQuery.inProgress) {
      return (
        <div>
          <LoadingIndicator message="Loading results..." />
        </div>
      );
    }

    if (!results || results.length < 1) {
      return (
        <div className="facility-result">
          No facilities found. Please try entering a different search term
          (Street, City, State or Zip) and click search to find facilities.
        </div>
      );
    }

    return (
      <div>
        <p>Search results near <strong>“{currentQuery.context}”</strong></p>
        <div>
          {
            results.map(r => {
              return isMobile ? (
                <div key={r.id} className="mobile-search-result">
                  <SearchResult result={r} currentLocation={currentQuery.position} />
                </div>
              ) : (
                <SearchResult key={r.id} result={r} currentLocation={currentQuery.position} />
              );
            })
          }
        </div>
        <Pagination
          onPageSelect={this.handlePageSelect}
          page={currentPage}
          pages={totalPages}
        />
      </div>
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array,
  isMobile: PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateSearchQuery,
      searchWithBounds,
    },
    dispatch,
  );
}

export default connect(
  null,
  mapDispatchToProps,
)(ResultsList);
