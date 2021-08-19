// Node modules.
import React, { useEffect, useState, useCallback } from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import URLSearchParams from 'url-search-params';
import { focusElement } from 'platform/utilities/ui';
import searchSettings from 'applications/search/manifest.json';
// Relative imports.
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

  const onSearch = useCallback(
    () => {
      const queryParams = new URLSearchParams();
      queryParams.set('query', userInput);

      const newUrl = `${window.location.pathname}?${queryParams}`;
      history.replaceState({}, '', newUrl);

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
        <strong>{query}</strong>"
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
        <a
          href={`${searchSettings.rootUrl}/?query=${encodeURIComponent(query)}`}
        >
          search all of VA.gov
        </a>
        .
      </>
    );
  }

  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-content vads-u-margin-bottom--0 medium-screen:vads-u-margin-bottom--3">
        {errorMessage && (
          <AlertBox
            headline="Something went wrong"
            status="error"
            content={errorMessage}
          />
        )}

        {articles && (
          <>
            <h1 className="vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
              Search results
            </h1>
            <SearchBar
              onSearch={onSearch}
              userInput={userInput}
              onInputChange={setUserInput}
            />
            <p
              className="vads-u-padding-x--1 large-screen:vads-u-padding-x--0"
              id="pagination-summary"
            >
              {paginationSummary}
            </p>
            <SearchResultList
              query={query}
              results={currentPageOfResults}
              totalResults={results.length}
              page={page}
            />
            <Pagination
              maxPageListLength={RESULTS_PER_PAGE}
              onPageSelect={onPageSelect}
              page={page}
              pages={totalPages}
              showLastPage
            />
          </>
        )}

        {!errorMessage &&
          !articles && (
            <LoadingIndicator message="Please wait while we load the application for you." />
          )}
      </div>
    </div>
  );
};

export default ResourcesAndSupportSearchApp;
