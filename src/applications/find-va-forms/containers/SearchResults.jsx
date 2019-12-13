// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
// Relative imports.
import { updateResultsAction } from '../actions';

const tableFields = [
  {
    label: 'VA form number',
    value: 'tableFieldID',
  },
  {
    label: 'Form name',
    value: 'tableFieldFormName',
  },
  {
    label: 'Description',
    value: 'tableFieldDescription',
  },
  {
    label: 'Available Online',
    value: 'tableFieldAvailableOnline',
  },
];

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortField: 'tableFieldID',
      sortOrder: 'ASC',
    };
  }

  onHeaderClick = field => {
    const { results, updateResults } = this.props;
    const { sortField, sortOrder } = this.state;

    // Only toggle sort order if they clicked on the same sortField.
    if (field === sortField) {
      // Derive the opposite sort order.
      const oppositeSortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';

      // Update our sortOrder in state.
      this.setState({ sortOrder: oppositeSortOrder });

      // Derive the sorted results.
      const sortedResults = orderBy(results, field, oppositeSortOrder);

      // Sort the results and update them in our store.
      updateResults(sortedResults);
      return;
    }

    // Otherwise, sort by the new field ASC.
    this.setState({ sortField: field, sortOrder: 'ASC' });

    // Derive the sorted results.
    const sortedResults = orderBy(results, field, 'ASC');

    // Sort the results and update them in our store.
    updateResults(sortedResults);
  };

  render() {
    const { onHeaderClick } = this;
    const { fetching, query, results } = this.props;
    const { sortField, sortOrder } = this.state;

    // Show loading indicator if we are fetching.
    if (fetching) {
      return <LoadingIndicator message="Loading search results..." />;
    }

    // Do not render if we have not fetched, yet.
    if (!results) {
      return null;
    }

    // Show no results found message.
    if (!results.length) {
      return (
        <h2 className="vads-u-font-size--lg vads-u-margin-top--1p5 vads-u-font-weight--normal">
          No results found for "<strong>{query}</strong>"
        </h2>
      );
    }

    return (
      <>
        <h2 className="vads-u-font-size--lg vads-u-margin-top--1p5 vads-u-font-weight--normal">
          Showing results for "<strong>{query}</strong>"
        </h2>

        <SortableTable
          className="vads-u-margin--0"
          currentSort={{ order: sortOrder, value: sortField }}
          data={results}
          fields={tableFields}
          onHeaderClick={onHeaderClick}
        />
      </>
    );
  }
}

SearchResults.propTypes = {
  // From mapStateToProps.
  fetching: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        firstIssuedOn: PropTypes.string.isRequired,
        formName: PropTypes.string.isRequired,
        lastRevisionOn: PropTypes.string.isRequired,
        pages: PropTypes.number.isRequired,
        sha256: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ),
};

const mapStateToProps = state => ({
  fetching: state.findVAFormsReducer.fetching,
  query: state.findVAFormsReducer.query,
  results: state.findVAFormsReducer.results,
});

const mapDispatchToProps = dispatch => ({
  updateResults: results => dispatch(updateResultsAction(results)),
});

export { SearchResults };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResults);
