import React from 'react';
import PropTypes from 'prop-types';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';
import {
  formatResponseString,
  truncateResponseString,
  removeDoubleBars,
} from '../utils';

const MAX_DESCRIPTION_LENGTH = 186;

const onSearchResultClick = ({ bestBet, title, index, url }) => e => {
  e.preventDefault();

  // clear the &t query param which is used to track typeahead searches
  // removing this will better reflect how many typeahead searches result in at least one click
  window.history.replaceState(
    null,
    document.title,
    `${window.location.href.replace('&t=true', '')}`,
  );

  const bestBetPosition = index + 1;
  const normalResultPosition =
    index + (this.props.search?.recommendedResults?.length || 0) + 1;
  const searchResultPosition = bestBet
    ? bestBetPosition
    : normalResultPosition;

  const query = this.props.router?.location?.query?.query || '';

  const encodedUrl = encodeURIComponent(url);
  const userAgent = encodeURIComponent(navigator.userAgent);
  const encodedQuery = encodeURIComponent(query);
  const apiRequestOptions = {
    method: 'POST',
  };
  const moduleCode = bestBet ? 'BOOS' : 'I14Y';

  // By implementing in this fashion (i.e. a promise chain), code that follows is not blocked by this api request. Following the link at the end of the
  // function should happen regardless of the result of this api request, and it can happen before this request resolves.
  apiRequest(
    `/search_click_tracking?position=${searchResultPosition}&query=${encodedQuery}&url=${encodedUrl}&user_agent=${userAgent}&module_code=${moduleCode}`,
    apiRequestOptions,
  ).catch(error => {
    Sentry.captureException(error);
    Sentry.captureMessage('search_click_tracking_error');
  });

  if (bestBet) {
    recordEvent({
      event: 'nav-searchresults',
      'nav-path': `Recommended Results -> ${title}`,
    });
  }

  recordEvent({
    event: 'onsite-search-results-click',
    'search-page-path': document.location.pathname,
    'search-query': query,
    'search-result-chosen-page-url': url,
    'search-result-chosen-title': title,
    'search-results-n-current-page': this.props.search?.currentPage,
    'search-results-position': searchResultPosition,
    'search-results-total-count': this.props.search?.totalEntries,
    'search-results-total-pages': Math.ceil(
      this.props.search?.totalEntries / 10,
    ),
    'search-results-top-recommendation': bestBet,
    'search-result-type': 'title',
    'search-selection': 'All VA.gov',
    'search-typeahead-used': this.state.typeaheadUsed,
  });

  // relocate to clicked link page
  window.location.href = url;
};

const Result = ({ result, index }) => {
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
          href={replaceWithStagingDomain(result.url)}
          text={strippedTitle}
          onClick={onSearchResultClick({
            bestBet: false,
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

const ResultsList = ({ loading, onSearchResultClick, query, results }) => {
  console.log('loading: ', loading);
  console.log('query: ',  query);
  console.log('results: ', results)

  if (results && results.length > 0) {
    return (
      <>
        <h3 className="sr-only">More search results</h3>
        <ul className="results-list" data-e2e-id="search-results">
          {results.map((result, index) =>
            <Result
              result={result}
              index={index}
              onSearchResultClick={onSearchResultClick}
            />
          )}
        </ul>
      </>
    );
  }

  return null;
   
};

ResultsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  onSearchResultClick: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.array
};

export default ResultsList;