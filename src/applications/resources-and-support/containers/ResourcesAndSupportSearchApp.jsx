import React, { useEffect, useState, useCallback } from 'react';
import URLSearchParams from 'url-search-params';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import SearchBar from '../components/SearchBar';
import SearchResultList from '../components/SearchResultList';

export default function ResourcesAndSupportSearchApp() {
  const [articles, setArticles] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState([]);

  const renderResults = useCallback(
    searchValue => {
      const filteredArticles = articles.filter(article => {
        return article.title.toLowerCase().includes(searchValue.toLowerCase());
      });
      setResults(filteredArticles);
    },
    [articles, setResults],
  );

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

  // Intialize the query via the URL params
  useEffect(
    () => {
      if (!articles) {
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const queryFromUrl = searchParams.get('query');
      if (queryFromUrl) {
        setUserInput(queryFromUrl);
        renderResults(queryFromUrl);
      }
    },
    [articles, setUserInput, renderResults],
  );

  const onSearch = useCallback(
    () => {
      const queryParams = new URLSearchParams();
      queryParams.set('query', userInput);
      const newUrl = `${window.location.pathname}?${queryParams}`;
      history.replaceState({}, '', newUrl);
      renderResults(userInput);
    },
    [userInput, renderResults],
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
                Showing {results.length} results for "
                <strong>{userInput}</strong>"
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
