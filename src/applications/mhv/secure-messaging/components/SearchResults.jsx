import React from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SearchResultItem from './SearchResultItem';

const results = [...Array(15).keys()];

const SearchResults = () => {
  return (
    <div className="search-results">
      <div className="search-results-sort">
        <va-select
          label="Sort messages by"
          name="searchResultsSort"
          value=""
          class="selectField"
        >
          <option value="newestToOldest">Newest to oldest</option>
          <option value="oldestToNewest">Oldest to newest</option>
          <option value="drafts">three</option>
        </va-select>

        <button type="button">Sort</button>
      </div>

      <div className="search-results-count">Displaying 1-10 of 15 messages</div>

      <ul className="search-results-list">
        {results.map((item, idx) => (
          <SearchResultItem key={idx} />
        ))}
      </ul>

      <VaPagination
        onPageSelect={function noRefCheck() {}}
        page={1}
        pages={2}
        className="search-results-pagination"
      />
    </div>
  );
};

export default SearchResults;
