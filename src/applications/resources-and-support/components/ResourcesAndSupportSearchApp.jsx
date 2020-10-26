import React, { useEffect, useState, useCallback } from 'react';
import sortBy from 'lodash/sortBy';

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

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);

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

      const keywords = query.split(' ').map(keyword => keyword.toLowerCase());

      const filteredArticles = articles.filter(article => {
        return keywords.some(k => {
          return article.title.toLowerCase().includes(k);
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
    paginationSummary = <>Please enter a query.</>;
  } else {
    paginationSummary = (
      <>
        No results found for "<strong>{query}</strong>"
      </>
    );
  }

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
          ) : (
            <LoadingIndicator message="Please wait while we load the application for you." />
          )}
        </div>
      </div>
    </div>
  );
}
