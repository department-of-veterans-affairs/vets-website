import React from 'react';
import PropTypes from 'prop-types';

const SCREENREADER_FOCUS_CLASSNAME = 'sr-focus';

const ResultsCounter = (
  currentPage,
  perPage,
  totalPages,
  totalEntries,
  loading,
  query,
  results,
  spellingCorrection
) => {
  let resultRangeEnd = currentPage * perPage;

  if (currentPage === totalPages) {
    resultRangeEnd = totalEntries;
  }

  const resultRangeStart = (currentPage - 1) * perPage + 1;

  if (loading || !totalEntries) return null;

  if (spellingCorrection) {
    return (
      <>
        
      </>
    );
  }

  // regular display for how many search results total are available.
  /* eslint-disable prettier/prettier */
  if (results && results.length > 0) {
    return (
      <>
        
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

export default ResultsCounter;