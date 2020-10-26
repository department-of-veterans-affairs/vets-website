import React, { useEffect, useState, useCallback } from 'react';
import URLSearchParams from 'url-search-params';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import SearchBar from '../components/SearchBar';
import SearchResultList from '../components/SearchResultList';

export default function ResourcesAndSupportSearchApp() {
  const [articles, setArticles] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

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

  // Refresh the results list when the query is submitted
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
    [articles, query, setResults],
  );

  const onSearch = useCallback(
    () => {
      const queryParams = new URLSearchParams();
      queryParams.set('query', userInput);

      const newUrl = `${window.location.pathname}?${queryParams}`;
      history.replaceState({}, '', newUrl);

      setQuery(userInput);
    },
    [userInput, setQuery],
  );

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
              <p>
                Showing {results.length} results for "<strong>{query}</strong>"
              </p>
              <SearchResultList results={results} />
            </>
          ) : (
            <LoadingIndicator message="Please wait while we load the application for you." />
          )}
        </div>
      </div>
    </div>
  );
}
