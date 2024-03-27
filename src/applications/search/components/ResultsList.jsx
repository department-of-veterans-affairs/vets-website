import React from 'react';
import PropTypes from 'prop-types';
import Result from './Result';

const ResultsList = ({ results }) => {
  if (results && results.length > 0) {
    return (
      <>
        <h3 className="sr-only">More search results</h3>
        <ul className="results-list" data-e2e-id="search-results">
          {results.map((result, index) => {
            console.log('result: ', result);
            console.log('index: ', index);
            // <Result
            //   isBestBet={false}
            //   result={result}
            //   index={index}
            // />
          })}
        </ul>
      </>
    );
  }

  return null;
};

ResultsList.propTypes = {
  onSearchResultClick: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.array
};

export default ResultsList;