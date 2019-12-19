// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import { connect } from 'react-redux';
import { orderBy, slice } from 'lodash';
// Relative imports.
import { updateResultsAction } from '../actions';

const ASCENDING = 'ASC';
const DESCENDING = 'DESC';
const FIELD_LABELS = [
  {
    label: 'VA form number',
    value: 'idLabel',
  },
  {
    label: 'Form name',
    value: 'titleLabel',
  },
  {
    label: 'Description',
    value: 'descriptionLabel',
  },
  {
    label: 'Available Online',
    value: 'availableOnlineLabel',
  },
];
const MAX_PAGE_LIST_LENGTH = 10;

class SearchResults extends Component {
  static propTypes = {
    // From mapStateToProps.
    fetching: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        // Original form data key-value pairs.
        firstIssuedOn: PropTypes.string.isRequired,
        formName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        lastRevisionOn: PropTypes.string.isRequired,
        pages: PropTypes.number.isRequired,
        sha256: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        // Table field labels that can be JSX.
        idLabel: PropTypes.node.isRequired,
        titleLabel: PropTypes.node.isRequired,
        descriptionLabel: PropTypes.node.isRequired,
        availableOnlineLabel: PropTypes.node.isRequired,
      }).isRequired,
    ),
    // From mapDispatchToProps.
    updateResults: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      selectedFieldLabel: 'idLabel',
      selectedFieldOrder: ASCENDING,
      startIndex: 0,
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
    // Derive the new start index.
    const startIndex = page * MAX_PAGE_LIST_LENGTH - 1;

    // Update the page and the new start index.
    this.setState({ page, startIndex });
  };

  sortResults = (fieldLabel, selectedFieldOrder = ASCENDING) => {
    const { results, updateResults } = this.props;

    // Update local state for SortableTable.
    this.setState({ selectedFieldLabel: fieldLabel, selectedFieldOrder });

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
    const { fetching, query, results } = this.props;
    const {
      page,
      selectedFieldLabel,
      selectedFieldOrder,
      startIndex,
    } = this.state;

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

    // Derive the last index.
    const lastIndex = startIndex + MAX_PAGE_LIST_LENGTH;

    // Derive the display labels.
    const startLabel = startIndex + 1;
    const lastLabel =
      lastIndex + 1 > results.length ? results.length : lastIndex + 1;

    return (
      <>
        <h2 className="vads-u-font-size--lg vads-u-margin-top--1p5 vads-u-font-weight--normal">
          Displaying {startLabel} - {lastLabel} out of {results.length} results
          for "<strong>{query}</strong>"
        </h2>

        {/* Table of Forms */}
        <SortableTable
          className="vads-u-margin--0"
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
            pages={Math.floor(results.length / MAX_PAGE_LIST_LENGTH)}
            showLastPage
          />
        )}
      </>
    );
  }
}

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
