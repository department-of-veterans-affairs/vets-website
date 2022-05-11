import React from 'react';

const HomepageSearch = () => {
  return (
    <div>
      <label htmlFor="site-search" className="usa-sr-only">
        Search the site:
      </label>
      <input
        type="search"
        id="site-search"
        name="q"
        className="vads-u-border--1px vads-u-border-color--gray-dark vads-u-padding--0"
      />
      <button type="submit" className="vads-u-margin-left--neg0p5">
        Search
      </button>

      {/* <VaSearchInput
        onInput={function noRefCheck(){}}
        onSubmit={function noRefCheck(){}}
        suggestions={[]}
        value=""
      /> */}
    </div>
  );
};

export default HomepageSearch;
