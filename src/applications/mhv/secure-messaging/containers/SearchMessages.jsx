import React from 'react';
import SectionGuideButton from '../components/SectionGuideButton';
import Breadcrumbs from '../components/Breadcrumbs';
import SearchForm from '../components/SearchMessagesForm';

const Search = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const advancedSearchOpen =
    queryParams.get('advanced') && queryParams.get('advanced') === 'true';

  const toggleAdvancedSearchHandler = () => {
    window.location.search = 'advanced=true';
  };

  return (
    <div className="vads-l-grid-container search-messages">
      <Breadcrumbs link="/search" pageName="Search" />
      <SectionGuideButton sectionName="Messages" />

      <div className="page-content">
        <h1 className="page-title">
          {advancedSearchOpen ? 'Advanced Search' : 'Search Messages'}
        </h1>

        <SearchForm advancedSearchOpen={advancedSearchOpen} />

        {!advancedSearchOpen && (
          <button
            type="button"
            className="link-button advanced-search-toggle"
            onClick={toggleAdvancedSearchHandler}
          >
            Or try the advanced search.
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
