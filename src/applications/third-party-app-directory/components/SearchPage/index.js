// Node modules.
import React from 'react';
// Relative imports.
import SearchForm from '../../containers/SearchForm';
import SearchResults from '../../containers/SearchResults';

export const SearchPage = () => (
  <div>
    {/* Search Form */}
    <SearchForm />

    {/* Search Results */}
    <SearchResults />

    {/* Questions Content */}
    <div className="feature">
      <h3>Have questions about connected apps?</h3>
      <p>
        Get answers to frequently asked questions about how connected
        third-party apps work, what types of information they can see, and the
        benefits of sharing your information.
      </p>
      <a href="" rel="noopener noreferrer">
        Go to connected apps FAQs
      </a>
    </div>
  </div>
);

export default SearchPage;
