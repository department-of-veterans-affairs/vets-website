import React from 'react';
import PropTypes from 'prop-types';
import Result from './Result';

const ResultsList = ({ loading, query, searchData, typeaheadUsed }) => {
  const SCREENREADER_FOCUS_CLASSNAME = 'sr-focus';
  const { results } = searchData;

  if (loading) {
    return <va-loading-indicator message="Loading results..." />;
  }

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

  if (query) {
    return (
      <p
        className={`${SCREENREADER_FOCUS_CLASSNAME}`}
        data-e2e-id="search-results-empty"
      >
        We didn’t find any results for "<strong>{query}</strong>
        ." Try using different words or checking the spelling of the words
        you’re using.
      </p>
    );
  }

  return (
    <p
      className={`${SCREENREADER_FOCUS_CLASSNAME}`}
      data-e2e-id="search-results-empty"
    >
      We didn’t find any results. Enter a keyword in the search box to try
      again.
    </p>
  );
};

ResultsList.propTypes = {
  loading: PropTypes.bool,
  query: PropTypes.string,
  searchData: PropTypes.object,
  typeaheadUsed: PropTypes.bool,
};

export default ResultsList;
