import React from 'react';
import SectionGuideButton from '../components/SectionGuideButton';
import Breadcrumbs from '../components/Breadcrumbs';
import SearchForm from '../components/SearchMessagesForm';

const Search = () => {
  return (
    <div className="vads-l-grid-container">
      <Breadcrumbs link="/search" pageName="Search" />
      <SectionGuideButton sectionName="Messages" />
      <h1 className="page-title">Search Messages</h1>
      <SearchForm />
      <div className="advanced-search-option">
        <a href="/advanced-search">Or try the advanced search.</a>
      </div>
    </div>
  );
};

export default Search;
