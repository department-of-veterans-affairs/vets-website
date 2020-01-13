// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import { connect } from 'react-redux';
import { orderBy, slice } from 'lodash';
// Relative imports.
import { updatePaginationAction, updateResultsAction } from '../actions';

const ASCENDING = 'ASC';
const DESCENDING = 'DESC';
const FIELD_LABELS = [
  {
    label: 'Form number',
    value: 'idLabel',
  },
  {
    label: 'Form name',
    value: 'titleLabel',
  },
  {
    label: 'Issue date',
    value: 'firstIssuedOnLabel',
  },
  {
    label: 'Revision date',
    value: 'lastRevisionOnLabel',
  },
];
export const MAX_PAGE_LIST_LENGTH = 10;

export class SearchResults extends Component {
  static propTypes = {
    // From mapStateToProps.
    error: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        // Original form data key-value pairs.
        firstIssuedOn: PropTypes.number.isRequired,
        formName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        lastRevisionOn: PropTypes.number.isRequired,
        pages: PropTypes.number.isRequired,
        sha256: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        // Table field labels that can be JSX.
        idLabel: PropTypes.node.isRequired,
        titleLabel: PropTypes.node.isRequired,
        firstIssuedOnLabel: PropTypes.node.isRequired,
        lastRevisionOnLabel: PropTypes.node.isRequired,
      }).isRequired,
    ),
    startIndex: PropTypes.number.isRequired,
    // From mapDispatchToProps.
    updatePagination: PropTypes.func.isRequired,
    updateResults: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedFieldLabel: 'idLabel',
      selectedFieldOrder: ASCENDING,
    };
  }

  onHeaderClick = (fieldLabel, order) => {
    const { selectedFieldLabel, selectedFieldOrder } = this.state;

    // Derive the opposite sort order.
    const oppositeFieldOrder =
      selectedFieldOrder === ASCENDING ? DESCENDING : ASCENDING;

    // Sort the results.
    this.sortResults(
      fieldLabel,
      fieldLabel === selectedFieldLabel ? oppositeFieldOrder : order,
    );
  };

  onPageSelect = page => {
    const { results, updatePagination } = this.props;

    // Derive the new start index.
    let startIndex = page * MAX_PAGE_LIST_LENGTH - MAX_PAGE_LIST_LENGTH;

    // Ensure the start index is not greater than the total amount of results.
    if (startIndex >= results.length) {
      startIndex = results.length - 1;
    }

    // Update the page and the new start index.
    updatePagination(page, startIndex);
  };

  sortResults = (fieldLabel, selectedFieldOrder = ASCENDING) => {
    const { results, updatePagination, updateResults } = this.props;

    // Update local state for SortableTable.
    this.setState({
      selectedFieldLabel: fieldLabel,
      selectedFieldOrder,
    });

    // Reset pagination values.
    updatePagination();

    // Derive the original field (not the JSX label).
    const field = fieldLabel.replace('Label', '');

    // Derive the sorted results.
    const sortedResults = orderBy(
      results,
      field,
      selectedFieldOrder.toLowerCase(),
    );

    // Sort the results and update them in our store.
    updateResults(sortedResults);
  };

  render() {
    const { onHeaderClick, onPageSelect } = this;
    const { error, fetching, page, query, results, startIndex } = this.props;
    const { selectedFieldLabel, selectedFieldOrder } = this.state;

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
          No results found for "<strong>{query}</strong>"
        </h2>
      );
    }

    // Derive the last index.
    const lastIndex = startIndex + MAX_PAGE_LIST_LENGTH;

    // Derive the display labels.
    const startLabel = startIndex + 1;
    const lastLabel =
      lastIndex + 1 > results.length ? results.length : lastIndex;

    // Derive the total number of pages.
    const totalPages = Math.ceil(results.length / MAX_PAGE_LIST_LENGTH);

    return (
      <>
        <h2 className="vads-u-font-size--lg vads-u-margin-top--1p5 vads-u-font-weight--normal">
          Displaying {startLabel} - {lastLabel} out of {results.length} results
          for "<strong>{query}</strong>"
        </h2>

        {/* Table of Forms */}
        <SortableTable
          className="find-va-forms-table vads-u-margin--0"
          currentSort={{ order: selectedFieldOrder, value: selectedFieldLabel }}
          data={slice(results, startIndex, lastIndex)}
          fields={FIELD_LABELS}
          onHeaderClick={onHeaderClick}
        />

        {/* Pagination Row */}
        {results.length > MAX_PAGE_LIST_LENGTH && (
          <Pagination
            maxPageListLength={MAX_PAGE_LIST_LENGTH}
            onPageSelect={onPageSelect}
            page={page}
            pages={totalPages}
            showLastPage
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  error: state.findVAFormsReducer.error,
  fetching: state.findVAFormsReducer.fetching,
  page: state.findVAFormsReducer.page,
  query: state.findVAFormsReducer.query,
  results: state.findVAFormsReducer.results,
  startIndex: state.findVAFormsReducer.startIndex,
});

const mapDispatchToProps = dispatch => ({
  updatePagination: (page, startIndex) =>
    dispatch(updatePaginationAction(page, startIndex)),
  updateResults: results => dispatch(updateResultsAction(results)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResults);
