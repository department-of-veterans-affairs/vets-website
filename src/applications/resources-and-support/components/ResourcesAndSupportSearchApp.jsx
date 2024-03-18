import React, { useEffect, useState, useCallback } from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import URLSearchParams from 'url-search-params';
import { focusElement } from 'platform/utilities/ui';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import SearchBar from './SearchBar';
import SearchResultList from './SearchResultList';
import useArticleData from '../hooks/useArticleData';
import useGetSearchResults from '../hooks/useGetSearchResults';
import { RESULTS_PER_PAGE } from '../constants';

const ResourcesAndSupportSearchApp = () => {
  const [articles, errorMessage] = useArticleData();
  const [userInput, setUserInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [results] = useGetSearchResults(articles, query, page);
  const [previousValue, setPreviousValue] = useState('');

  useEffect(
    () => {
      setPreviousValue(userInput);
    },
    [userInput],
  );

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);

  // Initialize the query via the URL params
  useEffect(
    () => {
      if (!articles) {
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const queryFromUrl = searchParams.get('query');

      if (queryFromUrl) {
        setUserInput(queryFromUrl);
        setQuery(queryFromUrl);
      } else {
        window.location.replace('/resources/');
      }
    },
    [articles, setUserInput, setQuery],
  );

  const setSearchData = useCallback(
    () => {
      setPage(1);
      setQuery(userInput);
      focusElement('#pagination-summary');
    },
    [userInput, setQuery],
  );

  const onPageSelect = useCallback(
    selectedPage => {
      setPage(selectedPage);
      focusElement('#pagination-summary');
    },
    [setPage],
  );

  const startIndex = (page - 1) * RESULTS_PER_PAGE;
  const endIndex = Math.min(page * RESULTS_PER_PAGE, results.length);

  const currentPageOfResults = results.slice(startIndex, endIndex);

  let paginationSummary = null;

  if (results.length > 0) {
    paginationSummary = (
      <>
        Showing {startIndex + 1} - {endIndex} of {results.length} results for "
        <strong className="vads-u-font-family--sans">{query}</strong>"
      </>
    );
  } else if (!query) {
    paginationSummary = <>Enter a query to get started.</>;
  } else {
    paginationSummary = (
      <>
        We didn’t find any resources and support articles for "
        <strong>{query}</strong>
        ." Try using different words or{' '}
        <va-link
          href={`${getAppUrl('search')}/?query=${encodeURIComponent(query)}`}
          text="search all of VA.gov"
        />
        .
      </>
    );
  }

  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-content vads-u-margin-bottom--0 medium-screen:vads-u-margin-bottom--3">
        {errorMessage && (
          <va-alert status="error" uswds>
            <h3 slot="headline">Something went wrong</h3>
            {errorMessage}
          </va-alert>
        )}

        {articles && (
          <>
            <h1 className="vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
              Resources and Support Search Results
            </h1>
            <SearchBar
              userInput={userInput}
              onInputChange={setUserInput}
              previousValue={previousValue}
              setSearchData={setSearchData}
            />
            <h2
              className="vads-u-max-width--full vads-u-margin-x--1 vads-u-font-family--sans vads-u-margin-top--2 medium-screen:vads-u-margin-top--0 large-screen:vads-u-padding-x--0 vads-u-font-size--base vads-u-margin-bottom--2p5 vads-u-font-weight--normal"
              id="pagination-summary"
            >
              {paginationSummary}
            </h2>
            <SearchResultList
              query={query}
              results={currentPageOfResults}
              totalResults={results.length}
              page={page}
            />
            <VaPagination
              maxPageListLength={RESULTS_PER_PAGE}
              onPageSelect={e => onPageSelect(e.detail.page)}
              page={page}
              pages={totalPages}
              showLastPage
              uswds
            />
          </>
        )}

        {!errorMessage &&
          !articles && (
            <va-loading-indicator message="Please wait while we load the application for you." />
          )}
      </div>
    </div>
  );
};

export default ResourcesAndSupportSearchApp;
