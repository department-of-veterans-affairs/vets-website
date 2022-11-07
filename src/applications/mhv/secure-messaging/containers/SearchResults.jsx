import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import MessageList from '../components/MessageList/MessageList';
import CondensedSearchForm from '../components/Search/CondensedSearchForm';
import { runBasicSearch } from '../actions/search';

const Search = () => {
  const dispatch = useDispatch();

  const { searchResults, folder, keyword } = useSelector(
    state => state.sm.search,
  );

  const submitBasicSearch = formData => {
    dispatch(runBasicSearch(formData.folder, formData.keyword.toLowerCase()));
  };

  const content = () => {
    if (!searchResults) {
      return (
        <va-loading-indicator
          message="Loading your secure messages..."
          setFocus
        />
      );
    }
    return (
      <CondensedSearchForm
        folder={folder}
        keyword={keyword}
        submitBasicSearch={submitBasicSearch}
      />
    );
  };

  return (
    <div
      className="vads-l-grid-container search-messages"
      data-testid="search-messages"
    >
      <h1 className="page-title">Search results</h1>

      {searchResults &&
        searchResults.length === 0 && (
          <p>
            We didn’t find any results for "<strong>{keyword}</strong>" in this
            folder. Try using different words or checking the spelling of the
            words you’re using, or try our advanced search.
          </p>
        )}

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
          <MessageList messages={searchResults} folder={folder} />
        )}
    </div>
  );
};

export default Search;
