import React from 'react';
import SearchResultCard from './search/SearchResultCard';
import TuitionAndHousingEstimates from '../containers/TuitionAndHousingEstimates';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import RefineYourSearch from '../containers/RefineYourSearch';
import { TABS } from '../constants';
import LocationSearchResults from './location/SearchResults';

export default function SearchResults({ search }) {
  if (search.inProgress) {
    return <LoadingIndicator message="Loading search results..." />;
  }

  if (search.tab === TABS.location) {
    return <LocationSearchResults search={search} />;
  }

  return (
    <>
      {search.query.name !== '' && (
        <div className="usa-grid vads-u-padding--1">
          <p>
            Showing <strong>{search.count} search results</strong> for '
            <strong>{search.query.name}</strong>'
          </p>
          <div className="usa-width-one-third">
            <TuitionAndHousingEstimates />
            <RefineYourSearch />
          </div>
          <div className="usa-width-two-thirds ">
            {search.count > 0 && (
              <div className="vads-l-row vads-u-flex-wrap--wrap">
                {search.results.map(institution => (
                  <SearchResultCard
                    institution={institution}
                    key={institution.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
