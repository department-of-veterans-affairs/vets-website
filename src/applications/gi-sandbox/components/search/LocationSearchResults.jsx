import React from 'react';
import SearchResultCard from './SearchResultCard';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';
import SearchAccordion from '../SearchAccordion';

export default function LocationSearchResults({ search }) {
  return (
    <>
      {search.location.count > 0 && (
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
                Showing <strong>{search.location.count} search results</strong>{' '}
                for '<strong>{search.query.location}</strong>'
              </p>
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
        </div>
      )}
    </>
  );
}
