import React from 'react';
import SearchResultCard from './SearchResultCard';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import LocationSearchResults from './location/SearchResults';
import { TABS } from '../constants';

export default function SearchResults({ search }) {
  if (search.inProgress) {
    return <LoadingIndicator message="Loading search results..." />;
  }

  if (search.tab === TABS.location) {
    return <LocationSearchResults search={search} />;
  }

  return (
    <>
      {search.count > 0 && (
        <div className="usa-grid vads-u-padding--1">
          <p>
            Showing <strong>{search.count} search results</strong> for '
            <strong>{search.query.name}</strong>'
          </p>
          <div className="usa-width-one-third">
            <h3>Filter Panel</h3>
          </div>
          <div className="usa-width-two-thirds vads-u-margin-right--neg2">
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
