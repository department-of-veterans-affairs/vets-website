import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory } from 'react-router-dom';
import MessageList from '../components/MessageList/MessageList';
import SearchForm from '../components/Search/SearchForm';

const Search = () => {
  const {
    awaitingResults,
    searchResults,
    folder,
    keyword,
    query,
  } = useSelector(state => state.sm.search);
  const history = useHistory();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  useEffect(
    () => {
      if (!awaitingResults && !searchResults) {
        history.goBack();
      }
    },
    [awaitingResults, searchResults],
  );

  const noResultsMessage = () => {
    if (keyword) {
      return (
        <p>
          We didn’t find any results for "<strong>{keyword}</strong>" in this
          folder. Try using different words or checking the spelling of the
          words you’re using, or try our advanced search.
        </p>
      );
    }
    return (
      <p>We didn’t find any results based on the search criteria provided.</p>
    );
  };

  const content = () => {
    if (!searchResults) {
      return (
        <va-loading-indicator
          message="Loading your secure messages..."
          setFocus
          data-testid="loading-indicator"
        />
      );
    }
    return (
      <SearchForm
        folder={folder}
        keyword={keyword}
        resultsCount={searchResults.length}
        query={query}
      />
    );
  };

  return (
    <div
      className="vads-l-grid-container search-results"
      data-testid="search-messages"
    >
      <h1 className="page-title">Search results</h1>

      {searchResults && searchResults.length === 0 && noResultsMessage()}

      {content()}

      {searchResults &&
        searchResults.length === 0 && (
          <VaAlert
            class="vads-u-margin-top--2"
            close-btn-aria-label="Close notification"
            disable-analytics="false"
            show-icon
            status="error" // success, error, warning, info, continue
          >
            <h2 slot="headline">No messages found</h2>
            <p>Your search returned no results.</p>
          </VaAlert>
        )}

      {searchResults &&
        searchResults.length > 0 && (
          <MessageList
            messages={searchResults}
            folder={folder}
            keyword={keyword}
            isSearch
          />
        )}
    </div>
  );
};

export default Search;
