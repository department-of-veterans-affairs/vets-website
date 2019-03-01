/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setFocus } from '../utils/helpers';
import { updateSearchQuery, searchWithBounds } from '../actions';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SearchResult from './SearchResult';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import { facilityTypes } from '../config';

class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.searchResultTitle = React.createRef();
  }
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.results !== this.props.results ||
      nextProps.inProgress !== this.props.inProgress
    );
  }

  componentDidUpdate() {
    if (this.searchResultTitle.current) {
      setFocus(this.searchResultTitle.current);
    }
  }

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
      context,
      facilityTypeName,
      inProgress,
      position,
      searchString,
      results,
      isMobile,
      pagination: { currentPage, totalPages },
    } = this.props;

    if (inProgress) {
      return (
        <div>
          <LoadingIndicator
            message={`Searching for ${facilityTypeName}
            in ${searchString}`}
            setFocus
          />
        </div>
      );
    }

    if (!results || results.length < 1) {
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      return (
        <div
          className="search-result-title facility-result"
          ref={this.searchResultTitle}
        >
          No facilities found. Please try entering a different search term
          (Street, City, State or Zip) and click search to find facilities.
        </div>
      );
      /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    }

    return (
      <div>
        {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
        <p className="search-result-title" ref={this.searchResultTitle}>
          {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
          {`${results.length} results for ${facilityTypeName} near `}
          <strong>“{context}”</strong>
        </p>
        <div>
          {results.map(r => {
            /* eslint-disable prettier/prettier */
            return isMobile ? (
              <div key={r.id} className="mobile-search-result">
                <SearchResult result={r} currentLocation={position} />
              </div>
            ) : (
              <SearchResult key={r.id} result={r} currentLocation={position} />
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

function mapStateToProps(state) {
  const {
    context,
    facilityType,
    inProgress,
    position,
    searchString,
  } = state.searchQuery;

  const facilityTypeName = facilityTypes[facilityType];

  return {
    context,
    facilityTypeName,
    inProgress,
    results: state.searchResult.results,
    pagination: state.searchResult.pagination,
    position,
    searchString,
    selectedResult: state.searchResult.selectedResult,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsList);
