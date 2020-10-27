import React from 'react';
import PropTypes from 'prop-types';

import { Article } from '../prop-types';

import SearchResult from './SearchResult';

export default function SearchResultList({ results }) {
  return (
    <ul className="usa-unstyled-list">
      {results.map((article, articleIndex) => {
        return (
          <li key={`article-${articleIndex}`}>
            <SearchResult article={article} />
          </li>
        );
      })}
    </ul>
  );
}

SearchResultList.propTypes = {
  results: PropTypes.arrayOf(Article).isRequired,
};
