// Dependencies.
import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';
// Relative imports.
import SearchResult from '../../components/SearchResult';

export class SearchResults extends Component {
  static propTypes = {
    // From mapStateToProps.
    error: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        // Original form data key-value pairs.
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
      }).isRequired,
    ),
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    totalResults: PropTypes.number,
  };

  render() {
    const {
      error,
      fetching,
      page,
      perPage,
      results,
      totalResults,
    } = this.props;

    // Show loading indicator if we are fetching.
    if (fetching) {
      return <LoadingIndicator message="Loading search results..." />;
    }

    // Show the error alert box if there was an error.
    if (error) {
      return (
        <AlertBox
          headline="Something went wrong"
          content={error}
          status="error"
        />
      );
    }

    // Do not render if we have not fetched, yet.
    if (!results) {
      return null;
    }

    // Show no results found message.
    if (!results.length) {
      return (
        <h2 className="vads-u-font-size--lg vads-u-margin-top--1p5 vads-u-font-weight--normal">
          No results found.
        </h2>
      );
    }

    // Derive values for "Displayed x-x out of x results."
    const resultsStartNumber = page * perPage - (perPage - 1);
    const resultsEndNumber =
      page * perPage > totalResults ? totalResults : page * perPage;

    return (
      <>
        <h2 className="vads-u-font-size--lg vads-u-margin-top--1p5 vads-u-font-weight--normal">
          Displaying {resultsStartNumber}-{resultsEndNumber} out of{' '}
          {totalResults} results
        </h2>

        {/* Table of Results */}
        <div className="vads-u-margin-top--2">
          {map(results, school => (
            <SearchResult key={school?.id} school={school} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          className="vads-u-border-top--0"
          onPageSelect={() => {}}
          page={page}
          pages={Math.ceil(totalResults / perPage)}
          maxPageListLength={perPage}
          showLastPage
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  error: state.yellowRibbonReducer.error,
  fetching: state.yellowRibbonReducer.fetching,
  results: state.yellowRibbonReducer.results,
  page: state.yellowRibbonReducer.page,
  perPage: state.yellowRibbonReducer.perPage,
  totalResults: state.yellowRibbonReducer.totalResults,
});

export default connect(
  mapStateToProps,
  null,
)(SearchResults);
