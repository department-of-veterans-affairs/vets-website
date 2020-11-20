import React from 'react';
import PropTypes from 'prop-types';

import { Article } from '../prop-types';

import SearchResult from './SearchResult';

export default function SearchResultList({ results, totalResults, query }) {
  return (
    <ul className="usa-unstyled-list">
      {results.map((article, articleIndex) => {
        return (
          <li key={`article-${articleIndex}`}>
            <SearchResult
              article={article}
              position={articleIndex + 1}
              query={query}
              totalResults={totalResults}
            />
          </li>
        );
      })}
    </ul>
  );
}

SearchResultList.propTypes = {
  query: PropTypes.string,
  results: PropTypes.arrayOf(Article).isRequired,
  totalResults: PropTypes.number,
};
