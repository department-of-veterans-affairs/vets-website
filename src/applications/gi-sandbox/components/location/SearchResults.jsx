import React from 'react';
import SearchResultCard from '../SearchResultCard';

export default function SearchResults({ search }) {
  return (
    <>
      {search.location.count > 0 && (
        <div className="usa-grid vads-u-padding--1">
          <p>
            Showing <strong>{search.location.count} search results</strong> for{' '}
            '<strong>{search.query.location}</strong>' within '
            <strong>{search.query.distance}</strong>' miles'
          </p>
          <div className="usa-width-one-third">
            <h3>Filter Panel</h3>
          </div>
          <div className="usa-width-two-thirds vads-u-margin-right--neg2">
            <div className="vads-l-row vads-u-flex-wrap--wrap">
              {search.location.results.map(institution => (
                <SearchResultCard
                  institution={institution}
                  key={institution.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
