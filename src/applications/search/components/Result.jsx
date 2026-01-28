import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';
import redactPii from 'platform/utilities/data/redactPii';
import {
  formatResponseString,
  truncateResponseString,
  removeDoubleBars,
} from '../utils';

const MAX_DESCRIPTION_LENGTH = 186;

const onSearchResultClick = ({
  bestBet,
  index,
  query,
  searchData,
  title,
  typeaheadUsed,
  url,
}) => async e => {
  const { currentPage, recommendedResults, totalEntries } = searchData;
  e.preventDefault();

  // clear the &t query param which is used to track typeahead searches
  // removing this will better reflect how many typeahead searches result in at least one click
  window.history.replaceState(
    null,
    document.title,
    `${window.location.href.replace('&t=true', '')}`,
  );

  const bestBetPosition = index + 1;
  const normalResultPosition = index + (recommendedResults?.length || 0) + 1;
  const searchResultPosition = bestBet ? bestBetPosition : normalResultPosition;

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
    `https://api.va.gov/v0/search_click_tracking?position=${searchResultPosition}&query=${encodedQuery}&url=${encodedUrl}&user_agent=${userAgent}&module_code=${moduleCode}`,
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
    'search-query': redactPii(query),
    'search-result-chosen-page-url': url,
    'search-result-chosen-title': title,
    'search-results-n-current-page': currentPage,
    'search-results-position': searchResultPosition,
    'search-results-total-count': totalEntries,
    'search-results-total-pages': Math.ceil(totalEntries / 10),
    'search-results-top-recommendation': bestBet,
    'search-result-type': 'title',
    'search-selection': 'All VA.gov',
    'search-typeahead-used': typeaheadUsed,
  });

  // relocate to clicked link page
  window.location.href = url;
};

const Result = ({
  index,
  isBestBet,
  query,
  result,
  searchData,
  snippetKey = 'snippet',
  typeaheadUsed,
}) => {
  const strippedTitle = removeDoubleBars(
    formatResponseString(result?.title, true),
  );

  if (result?.title && result?.url) {
    return (
      <li key={result.url} className="result-item vads-u-margin-bottom--4">
        <h4
          className="vads-u-display--inline vads-u-margin-top--1 vads-u-margin-bottom--0p25 vads-u-font-size--h3 vads-u-font-weight--bold vads-u-font-family--serif vads-u-text-decoration--underline"
          data-e2e-id="result-title"
        >
          <va-link
            disable-analytics
            href={replaceWithStagingDomain(result.url)}
            text={strippedTitle}
            onClick={onSearchResultClick({
              bestBet: isBestBet,
              index,
              query,
              searchData,
              title: strippedTitle,
              typeaheadUsed,
              url: replaceWithStagingDomain(result.url),
            })}
          />
        </h4>
        <p
          className="result-desc"
          /* eslint-disable react/no-danger */
          dangerouslySetInnerHTML={{
            __html: formatResponseString(
              truncateResponseString(
                result[snippetKey],
                MAX_DESCRIPTION_LENGTH,
              ),
            ),
          }}
          /* eslint-enable react/no-danger */
        />
        <p className="result-url vads-u-color--gray vads-u-font-size--base">
          {replaceWithStagingDomain(result.url)}
        </p>
      </li>
    );
  }

  return null;
};

Result.propTypes = {
  index: PropTypes.number.isRequired,
  isBestBet: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  result: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  searchData: PropTypes.shape({
    currentPage: PropTypes.number,
    recommendedResults: PropTypes.array,
    totalEntries: PropTypes.number,
  }).isRequired,
  typeaheadUsed: PropTypes.bool.isRequired,
  snippetKey: PropTypes.string,
};

export default Result;
