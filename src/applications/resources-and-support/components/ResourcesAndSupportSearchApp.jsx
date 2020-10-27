import React, { useEffect, useState, useCallback } from 'react';
import sortBy from 'lodash/sortBy';
import * as Sentry from '@sentry/browser';
import URLSearchParams from 'url-search-params';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import { focusElement } from 'platform/utilities/ui';

import SearchBar from './SearchBar';
import SearchResultList from './SearchResultList';

const RESULTS_PER_PAGE = 10;

export default function ResourcesAndSupportSearchApp() {
  const [articles, setArticles] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);

  // Load up the article data file
  useEffect(
    () => {
      const getJson = async () => {
        try {
          const response = await fetch('/resources/search/articles.json');
          const json = await response.json();

          setArticles(json);
        } catch (error) {
          Sentry.withScope(scope => {
            scope.setExtra('error', error);
            Sentry.captureMessage(
              'Resources and support - failed to load dataset',
            );
          });
          setErrorMessage(
            'We’re sorry. Something went wrong on our end. Please try again later.',
          );
        }
      };

      getJson();
    },
    [setArticles, setErrorMessage],
  );

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
      }
    },
    [articles, setUserInput, setQuery],
  );

  // Refresh the results list when the query is submitted or the page is changed.
  useEffect(
    () => {
      if (!articles || !query) {
        return;
      }

      const keywords = query
        .split(' ')
        .map(keyword => keyword.toLowerCase())
        .map(keyword => {
          if (keyword.length > 3 && keyword.endsWith('s')) {
            // Unpluralize the word, so that a search for "claims"
            // will still yield articles titled "claim or appeal status"
            return keyword.slice(0, keyword.length - 1);
          }
          return keyword;
        });

      const filteredArticles = articles.filter(article => {
        const tags = article.fieldTags?.entity?.fieldTopics
          ?.map(topic => topic.entity.name)
          .join();

        return keywords.some(k => {
          return (
            article.title.toLowerCase().includes(k) ||
            article.fieldPrimaryCategory?.entity?.name?.includes(k) ||
            tags?.includes(k)
          );
        });
      });

      const orderedResults = sortBy(filteredArticles, 'title');

      setResults(orderedResults);
    },
    [articles, setResults, query, page],
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
        We didn't find any resources and support articles for "
        <strong>{query}</strong>
        ." Try using different words or{' '}
        <a href={`/search?query=${encodeURIComponent(query)}`}>
          search all of VA.gov
        </a>
        .
      </>
    );
  }

  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-width-three-fourths">
        <div className="usa-content vads-u-margin-bottom--3">
          {errorMessage && (
            <AlertBox
              headline="Something went wrong"
              status="error"
              content={errorMessage}
            />
          )}

          {articles && (
            <>
              <h1>Search results</h1>
              <SearchBar
                onSearch={onSearch}
                userInput={userInput}
                onInputChange={setUserInput}
              />
              <p id="pagination-summary">{paginationSummary}</p>
              <SearchResultList results={currentPageOfResults} />
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
    </div>
  );
}
