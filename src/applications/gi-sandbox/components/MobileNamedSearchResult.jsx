import React from 'react';
import SearchResultCard from '../containers/SearchResultCard';

export function MobileNamedSearchResults({ search }) {
  const { count, results } = search.name;

  return (
    <div>
      <p className="vads-u-padding-x--2p5">
        Showing <strong>{count} search results</strong> for '
        <strong>{search.query.name}'</strong>
      </p>
      {count > 0 && (
        <div className="vads-l-row vads-u-flex-wrap--wrap vads-u-padding-right--2p5">
          {results.map(institution => (
            <SearchResultCard
              institution={institution}
              key={institution.facilityCode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MobileNamedSearchResults;
