import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();

  useEffect(
    () => {
      if (!awaitingResults && !searchResults) {
        history.goBack();
      }
    },
    [awaitingResults, searchResults],
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
