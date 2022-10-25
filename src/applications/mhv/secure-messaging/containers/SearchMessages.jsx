import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import BasicSearchForm from '../components/Search/BasicSearchForm';
import AdvancedSearchForm from '../components/Search/AdvancedSearchForm';
import { runBasicSearch } from '../actions/search';

const Search = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const folders = useSelector(state => state.sm.folders.folderList);

  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

  const { pathname } = location;

  useEffect(
    () => {
      if (pathname === '/search/advanced') {
        setAdvancedSearchOpen(true);
      } else {
        setAdvancedSearchOpen(false);
      }
    },
    [pathname],
  );

  const toggleAdvancedSearchHandler = () => {
    history.push('/search/advanced');
  };

  const submitBasicSearch = formData => {
    dispatch(runBasicSearch(formData.folder, formData.keyword.toLowerCase()));
    history.push('/search/results');
  };

  let pageTitle;
  if (advancedSearchOpen) {
    pageTitle = 'Advanced search';
  } else {
    pageTitle = 'Search messages';
  }

  const content = () => {
    if (!folders) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
        />
      );
    }
    if (advancedSearchOpen) return <AdvancedSearchForm folders={folders} />;
    return (
      <BasicSearchForm
        folders={folders}
        toggleAdvancedSearch={toggleAdvancedSearchHandler}
        submitBasicSearch={submitBasicSearch}
      />
    );
  };

  return (
    <div
      className="vads-l-grid-container search-messages"
      data-testid="search-messages"
    >
      <h1 className="page-title">{pageTitle}</h1>

      {content()}
    </div>
  );
};

export default Search;
