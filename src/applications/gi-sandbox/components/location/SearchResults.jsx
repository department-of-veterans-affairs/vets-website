import React from 'react';
import SearchResultCard from '../search/SearchResultCard';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';
import RefineYourSearch from '../../containers/RefineYourSearch';

export default function SearchResults({ search }) {
  const { count, results } = search.location;
  const { location } = search.query;

  return (
    <>
      {count > 0 && (
        <div>
          <div>
            <TuitionAndHousingEstimates />
            <RefineYourSearch />
            <div className="usa-grid vads-u-padding--1">
              <p>
                Showing <strong>{count} search results</strong> for '
                <strong>{location}</strong>'
              </p>
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
        </div>
      )}
    </>
  );
}
