// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import { connect } from 'react-redux';

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

const SearchResults = ({ fetching, query, results }) => {
  if (fetching) {
    return <LoadingIndicator message="Loading search results..." />;
  }

  if (!results) {
    return null;
  }

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
        currentSort={{ order: 'ASC', value: 'title' }}
        data={results}
        fields={tableFields}
      />
    </>
  );
};

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

export { SearchResults };

export default connect(
  mapStateToProps,
  null,
)(SearchResults);
