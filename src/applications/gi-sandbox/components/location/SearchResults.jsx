import React from 'react';
import SearchResultCard from '../search/SearchResultCard';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';
import SearchAccordion from '../SearchAccordion';

export default function SearchResults({ search }) {
  const { count, results } = search.location;
  const { location } = search.query;

  return (
    <>
      {count > 0 && (
        <div>
          <div>
            <TuitionAndHousingEstimates />
            <SearchAccordion
              button={'Refine your search'}
              buttonLabel="Update results"
              buttonOnClick={() => {}}
            />
            <div className="usa-grid vads-u-padding--1">
              <p>
                Showing <strong>{count} search results</strong> for '
                <strong>{location}</strong>'
              </p>
              <div className="vads-l-row vads-u-flex-wrap--wrap">
                {results.map(institution => (
                  <SearchResultCard
                    institution={institution}
                    key={institution.id}
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
