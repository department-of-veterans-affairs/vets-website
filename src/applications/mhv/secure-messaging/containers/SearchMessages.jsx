import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import CondensedSearchForm from '../components/CondensedSearchForm';

const Search = () => {
  const searchParams = {};
  const history = useHistory();
  const location = useLocation();

  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const searchRequested = !!Object.keys(searchParams).length;

  const toggleAdvancedSearchHandler = () => {
    history.push('/search?advanced=true');
    setAdvancedSearchOpen(true);
  };

  useEffect(
    () => {
      if (location.search === '?advanced=true') {
        setAdvancedSearchOpen(true);
      } else {
        setAdvancedSearchOpen(false);
      }
    },
    [location.search],
  );

  let pageTitle;
  let altAdvancedSearchToggle;
  if (!searchRequested && advancedSearchOpen) {
    pageTitle = 'Advanced search';
  } else if (!searchRequested && !advancedSearchOpen) {
    pageTitle = 'Search messages';
    altAdvancedSearchToggle = (
      <button
        type="button"
        className="link-button advanced-search-toggle"
        onClick={toggleAdvancedSearchHandler}
      >
        Or try the advanced search.
      </button>
    );
  } else if (searchRequested) pageTitle = 'Search results';

  return (
    <div
      className="vads-l-grid-container search-messages"
      data-testid="search-messages"
    >
      <h1 className="page-title">{pageTitle}</h1>

      {searchRequested ? (
        <CondensedSearchForm query={searchParams} />
      ) : (
        <SearchForm
          advancedSearchOpen={advancedSearchOpen}
          keyword={searchParams.keyword}
        />
      )}

      {altAdvancedSearchToggle}

      {searchRequested && <SearchResults />}
    </div>
  );
};

export default Search;
