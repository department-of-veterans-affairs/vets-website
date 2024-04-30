import React from 'react';
import PropTypes from 'prop-types';
import Result from './Result';

const ResultsList = ({ query, searchData, typeaheadUsed }) => {
  const { results } = searchData;

  if (results && results.length > 0) {
    return (
      <>
        <h3 className="sr-only">More search results</h3>
        <ul className="results-list" data-e2e-id="search-results">
          {results.map((result, index) => (
            <Result
              index={index}
              isBestBet={false}
              key={index}
              query={query}
              result={result}
              searchData={searchData}
              typeaheadUsed={typeaheadUsed}
            />
          ))}
        </ul>
      </>
    );
  }

  return null;
};

ResultsList.propTypes = {
  query: PropTypes.string,
  searchData: PropTypes.object,
  typeaheadUsed: PropTypes.bool,
};

export default ResultsList;
