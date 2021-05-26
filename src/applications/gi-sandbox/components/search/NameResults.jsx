import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import SearchResultCard from './SearchResultCard';
import RefineYourSearch from '../../containers/RefineYourSearch';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';

export default function NameResults({ search }) {
  const { inProgress } = search;
  const { count, results } = search.name;
  const { name } = search.query;

  return (
    <>
      {inProgress && <LoadingIndicator message="Loading search results..." />}
      {!inProgress &&
        name !== '' && (
          <div className="usa-grid vads-u-padding--1">
            <p>
              Showing <strong>{count} search results</strong> for '
              <strong>{name}</strong>'
            </p>
            <div className="usa-width-one-third">
              <TuitionAndHousingEstimates />
              <RefineYourSearch />
            </div>
            <div className="usa-width-two-thirds ">
              {count > 0 && (
                <div className="vads-l-row vads-u-flex-wrap--wrap">
                  {results.map(institution => (
                    <SearchResultCard
                      institution={institution}
                      key={institution.facilityCode}
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
