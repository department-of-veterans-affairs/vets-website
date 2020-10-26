import React from 'react';

export default function SearchResultList({ results }) {
  return (
    <ul className="usa-unstyled-list">
      {results.map(article => {
        return (
          <li key={article.entityId}>
            <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-color--gray-lighter">
              <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
                <a href="{{ article.entityUrl.path }}">{article.title}</a>
              </h2>
              <p className="vads-u-margin-bottom--0">{article.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
