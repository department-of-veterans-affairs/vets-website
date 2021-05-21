import React from 'react';
import SearchResultCard from './SearchResultCard';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';

export default function SearchResults({ search }) {
  return (
    <>
      {search.count > 0 && (
        <div className="usa-grid vads-u-padding--1">
          <p>
            Showing <strong>{search.count} search results</strong> for '
            <strong>{search.query.name}</strong>'
          </p>
          <div className="usa-width-one-third">
            <TuitionAndHousingEstimates />
          </div>
          <div className="usa-width-two-thirds ">
            <div className="vads-l-row vads-u-flex-wrap--wrap">
              {search.results.map(institution => (
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
