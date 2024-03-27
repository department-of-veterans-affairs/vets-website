import React from 'react';
import PropTypes from 'prop-types';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';
import {
  formatResponseString,
  truncateResponseString,
  removeDoubleBars,
} from '../utils';

const MAX_DESCRIPTION_LENGTH = 186;

const Result = (result, isBestBet = false, index) => {
  const strippedTitle = removeDoubleBars(
    formatResponseString(result.title, true),
  );

  return (
    <li
      key={result.url}
      className="result-item vads-u-margin-top--1p5 vads-u-margin-bottom--4"
    >
      <h4
        className="vads-u-display--inline  vads-u-margin-top--1 vads-u-margin-bottom--0p25 vads-u-font-size--md vads-u-font-weight--bold vads-u-font-family--serif vads-u-text-decoration--underline"
        data-e2e-id="result-title"
      >
        <va-link
          className="result-title"
          href={replaceWithStagingDomain(result.url)}
          text={strippedTitle}
          dangerouslySetInnerHTML={{
            __html: strippedTitle,
          }}
          onClick={this.onSearchResultClick({
            bestBet: isBestBet,
            title: strippedTitle,
            index,
            url: replaceWithStagingDomain(result.url),
            // Trigger a new build
          })}
        />
      </h4>
      <p className="result-url vads-u-color--green vads-u-font-size--base">
        {replaceWithStagingDomain(result.url)}
      </p>
      <p
        className="result-desc"
        dangerouslySetInnerHTML={{
          __html: formatResponseString(
            truncateResponseString(
              result.snippet,
              MAX_DESCRIPTION_LENGTH,
            ),
          ),
        }}
      />
    </li>
  );
}

const ResultsList = (loading, query, results) => {
  if (loading) {
    return <va-loading-indicator message="Loading results..." />;
  }

  if (results && results.length > 0) {
    return (
      <>
        <h3 className="sr-only">More search results</h3>
        <ul className="results-list" data-e2e-id="search-results">
          {results.map((result, index) =>
            <Result
              result={result}
              isBestBet={undefined}
              index={index}
            />
          )}
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
        We didn't find any results for "<strong>{query}</strong>
        ." Try using different words or checking the spelling of the words
        you're using.
      </p>
    );
  }

  return (
    <p
      className={`${SCREENREADER_FOCUS_CLASSNAME}`}
      data-e2e-id="search-results-empty"
    >
      We didn't find any results. Enter a keyword in the search box to try
      again.
    </p>
  );
};

ResultsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.array
};

export default ResultsList;