import React from 'react';
import PropTypes from 'prop-types';

const SCREENREADER_FOCUS_CLASSNAME = 'sr-focus';

const ResultsCounter = (
  query,
  resultRangeEnd,
  resultRangeStart,
  results,
  spellingCorrection,
  totalEntries,
) => {
  if (spellingCorrection) {
    return (
      <>
        <p className="vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--normal vads-u-margin-top--2p5 vads-u-margin-bottom--1p5">
          No results for "
          <span className="vads-u-font-weight--bold">
            {query}
          </span>
          "
        </p>
        <h2
          className={`${SCREENREADER_FOCUS_CLASSNAME} vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--normal vads-u-margin-y--0p5`}
        >
          Showing{' '}
          {totalEntries === 0 ? '0' : `${resultRangeStart}-${resultRangeEnd}`}{' '}
          of {totalEntries} results for "
          <span className="vads-u-font-weight--bold">
            {spellingCorrection}
          </span>
          "
        </h2>
        <hr className="vads-u-margin-y--3" aria-hidden="true" />
      </>
    )
  }

  // regular display for how many search results total are available.
  /* eslint-disable prettier/prettier */
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
          <span className="vads-u-font-weight--bold">
            {query}
          </span>
          "
        </h2>
        <hr className="vads-u-margin-y--3" aria-hidden="true" />
      </>
    );
  }

  return null;
  /* eslint-enable prettier/prettier */
};

ResultsCounter.propTypes = {
  query: PropTypes.string.isRequired,
  resultRangeEnd: PropTypes.string.isRequired,
  resultRangeStart: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
  spellingCorrection: PropTypes.bool.isRequired,
  totalEntries: PropTypes.number.isRequired
};

export default SearchResults;