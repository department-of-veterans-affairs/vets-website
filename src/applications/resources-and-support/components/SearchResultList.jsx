import React from 'react';

import PropTypes from 'prop-types';
import { Article } from '../prop-types';

export default function SearchResultList({ results }) {
  return (
    <ul className="usa-unstyled-list">
      {results.map((article, index) => {
        return (
          <li key={index}>
            <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-color--gray-lighter">
              <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
                <a href="{{ article.entityUrl.path }}">{article.title}</a>
              </h2>
              <p
                className="vads-u-margin-bottom--0"
                // the article descriptions contain HTML entities
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

SearchResultList.propTypes = {
  results: PropTypes.arrayOf(Article).isRequired,
};
