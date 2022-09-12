import React from 'react';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import CondensedSearchForm from '../components/CondensedSearchForm';

const Search = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const searchParams = {};
  let advanced;
  for (const [key, value] of queryParams.entries()) {
    if (key === 'advanced') advanced = value;
    else searchParams[key] = value;
  }

  const advancedSearchOpen = advanced && advanced === 'true';
  const searchRequested = !!Object.keys(searchParams).length;

  const toggleAdvancedSearchHandler = () => {
    queryParams.append('advanced', 'true');
    window.location.search = queryParams;
  };

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
    <div className="vads-l-grid-container search-messages">
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
