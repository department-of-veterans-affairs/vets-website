import React from 'react';
import SearchResultCard from './SearchResultCard';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';

export default function SearchResults({ search }) {
  const { count, results } = search.name;
  const { name } = search.query;

  return (
    <>
      {count > 0 && (
        <div className="usa-grid vads-u-padding--1">
          <p>
            Showing <strong>{count} search results</strong> for '
            <strong>{name}</strong>'
          </p>
          <div className="usa-width-one-third">
            <TuitionAndHousingEstimates />
          </div>
          <div className="usa-width-two-thirds ">
            <div className="vads-l-row vads-u-flex-wrap--wrap">
              {results.map(institution => (
                <SearchResultCard
                  institution={institution}
                  key={institution.facilityCode}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
