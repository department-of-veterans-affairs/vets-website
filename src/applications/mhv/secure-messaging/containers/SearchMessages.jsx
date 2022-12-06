import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BasicSearchForm from '../components/Search/BasicSearchForm';
import AdvancedSearchForm from '../components/Search/AdvancedSearchForm';

const Search = () => {
  const history = useHistory();
  const location = useLocation();

  const folders = useSelector(state => state.sm.folders.folderList);

  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

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
          message="Loading your secure messages..."
          setFocus
        />
      );
    }
    if (advancedSearchOpen) return <AdvancedSearchForm folders={folders} />;
    return (
      <BasicSearchForm
        folders={folders}
        toggleAdvancedSearch={toggleAdvancedSearchHandler}
      />
    );
  };

  return (
    <div className="vads-l-grid-container search-messages">
      <h1 className="page-title">{pageTitle}</h1>

      {content()}
    </div>
  );
};

export default Search;
