import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import MessageList from '../components/MessageList/MessageList';
import NoFilterMatchWarning from '../components/Search/NoFilterMatchWarning';

const SearchResults = () => {
  const {
    awaitingResults,
    searchResults,
    searchFolder,
    keyword,
    searchSort,
    page,
  } = useSelector(state => state.sm.search);
  const navigate = useNavigate();

  useEffect(
    () => {
      if (!awaitingResults && !searchResults) {
        navigate(-1);
      }
    },
    [awaitingResults, searchResults, navigate],
  );

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
    return null;
  };

  return (
    <div className="search-results" data-testid="search-messages">
      {/* <h1 className="page-title">Search results</h1> */}

      {searchResults && !searchResults.length && <NoFilterMatchWarning />}

      {content()}

      {searchResults &&
        searchResults.length > 0 && (
          <MessageList
            messages={searchResults}
            folder={searchFolder}
            keyword={keyword}
            isSearch
            sortOrder={searchSort}
            page={page}
          />
        )}
    </div>
  );
};

export default SearchResults;
