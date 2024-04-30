import React from 'react';
import PropTypes from 'prop-types';

const SCREENREADER_FOCUS_CLASSNAME = 'sr-focus';

const ResultsCounter = ({
  currentPage,
  loading,
  perPage,
  query,
  results,
  spellingCorrection,
  totalPages,
  totalEntries,
}) => {
  let resultRangeEnd = currentPage * perPage;

  if (currentPage === totalPages) {
    resultRangeEnd = totalEntries;
  }

  const resultRangeStart = (currentPage - 1) * perPage + 1;

  if (loading || !totalEntries) {
    return null;
  }

  if (spellingCorrection) {
    return (
      <>
        <p className="vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--normal vads-u-margin-top--2p5 vads-u-margin-bottom--1p5">
          No results for "
          <span className="vads-u-font-weight--bold">{query}</span>"
        </p>
        <h2
          className={`${SCREENREADER_FOCUS_CLASSNAME} vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--normal vads-u-margin-y--0p5`}
        >
          Showing{' '}
          {totalEntries === 0 ? '0' : `${resultRangeStart}-${resultRangeEnd}`}{' '}
          of {totalEntries} results for "
          <span className="vads-u-font-weight--bold">{spellingCorrection}</span>
          "
        </h2>
        <hr className="vads-u-margin-y--3" aria-hidden="true" />
      </>
    );
  }

  if (results && results.length > 0) {
    return (
      <>
        <h2
          aria-live="polite"
          aria-relevant="additions text"
          className={`${SCREENREADER_FOCUS_CLASSNAME} vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--normal`}
        >
          Showing{' '}
          {totalEntries === 0 ? '0' : `${resultRangeStart}-${resultRangeEnd}`}{' '}
          of {totalEntries} results for "
          <span className="vads-u-font-weight--bold">{query}</span>"
        </h2>
        <hr className="vads-u-margin-y--3" aria-hidden="true" />
      </>
    );
  }

  return null;
};

ResultsCounter.propTypes = {
  currentPage: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  perPage: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
  spellingCorrection: PropTypes.bool.isRequired,
  totalEntries: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default ResultsCounter;
