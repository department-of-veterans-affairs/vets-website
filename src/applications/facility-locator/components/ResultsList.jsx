/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateSearchQuery, searchWithBounds } from '../actions';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SearchResult from './SearchResult';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import { distBetween } from '../utils/facilityDistance';

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
    const {
      results,
      isMobile,
      currentQuery,
      pagination: { currentPage, totalPages },
    } = this.props;

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
    const currentLocation = currentQuery.position;

    const sortedResults = results
      .map(result => {
        const distance = currentLocation
          ? distBetween(
              currentLocation.latitude,
              currentLocation.longitude,
              result.attributes.lat,
              result.attributes.long,
            )
          : null;
        return { ...result, distance };
      })
      .sort((resultA, resultB) => {
        return resultA.distance - resultB.distance;
      });

    return (
      <div>
        <p>
          Search results near <strong>“{currentQuery.context}”</strong>
        </p>
        <div>
          {sortedResults.map(r => {
            /* eslint-disable prettier/prettier */
            return isMobile ? (
              <div key={r.id} className="mobile-search-result">
                <SearchResult result={r} />
              </div>
            ) : (
              <SearchResult key={r.id} result={r} />
            );
            /* eslint-enable prettier/prettier */
          })}
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
