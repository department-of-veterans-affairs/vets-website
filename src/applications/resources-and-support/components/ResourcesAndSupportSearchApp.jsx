import React, { useEffect, useState, useCallback } from 'react';
import URLSearchParams from 'url-search-params';
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

  const totalPages = results.length / RESULTS_PER_PAGE;

  // Load up the article data file
  useEffect(
    () => {
      const getJson = async () => {
        const response = await fetch('/resources/search/articles.json');
        const json = await response.json();

        setArticles(json);
      };

      getJson();
    },
    [setArticles],
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

      const filteredArticles = articles.filter(article => {
        return article.title.toLowerCase().includes(query.toLowerCase());
      });

      setResults(filteredArticles);
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

  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-width-three-fourths">
        <div className="usa-content">
          {articles ? (
            <>
              <h1>Search results</h1>
              <SearchBar
                onSearch={onSearch}
                userInput={userInput}
                onInputChange={setUserInput}
              />
              <p id="pagination-summary">
                {results.length > 0 ? (
                  <>
                    Showing {startIndex + 1} - {endIndex} of {results.length}{' '}
                    results for "<strong>{query}</strong>"
                  </>
                ) : !query ? (
                  <>Please enter a query.</>
                ) : (
                  <>
                    No results found for "<strong>{query}</strong>"
                  </>
                )}
              </p>
              <SearchResultList results={currentPageOfResults} />
              <Pagination
                maxPageListLength={RESULTS_PER_PAGE}
                onPageSelect={onPageSelect}
                page={page}
                pages={totalPages}
                showLastPage
              />
            </>
          ) : (
            <LoadingIndicator message="Please wait while we load the application for you." />
          )}
        </div>
      </div>
    </div>
  );
}
