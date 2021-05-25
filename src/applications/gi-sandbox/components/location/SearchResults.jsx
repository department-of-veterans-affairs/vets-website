import React from 'react';

import SearchResultCard from '../search/SearchResultCard';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';
import RefineYourSearch from '../../containers/RefineYourSearch';
import { numberToLetter } from '../../utils/helpers';

export default function SearchResults({ search }) {
  const { count, results } = search.location;
  const { location } = search.query;

  const resultCards = results.map((institution, index) => {
    const { name, city, state, distance } = institution;
    const miles = Number.parseFloat(distance).toFixed(2);
    const letter = numberToLetter(index + 1);

    const header = (
      <>
        <div className="location-header vads-u-display--flex vads-u-padding-top--1">
          <span className="location-letter vads-u-font-size--sm">{letter}</span>
          <span className="vads-u-padding-x--0p5 vads-u-font-size--sm">
            <strong>{miles} miles</strong>
          </span>
          <span className="vads-u-font-size--sm">{`${city}, ${state}`}</span>
        </div>
        <div>
          <h3 className="vads-u-margin-top--2">{name}</h3>
        </div>
      </>
    );

    return (
      <SearchResultCard
        institution={institution}
        key={institution.facilityCode}
        header={header}
        location
      />
    );
  });

  return (
    <>
      <div className={'location-search'}>
        <div className={'usa-width-one-third'}>
          {count === null && (
            <div>
              Please enter a location (street, city, state, or postal code) then
              click search above to find institutions.
            </div>
          )}
          {location !== '' && (
            <>
              <TuitionAndHousingEstimates />
              <RefineYourSearch />
              <div className="location-search-results-container usa-grid vads-u-padding--1p5">
                <p>
                  Showing <strong>{count} search results</strong> for '
                  <strong>{location}</strong>'
                </p>
                <div
                  id="location-search-results"
                  className="location-search-results vads-l-row vads-u-flex-wrap--wrap"
                >
                  {resultCards}
                </div>
              </div>
            </>
          )}
          {count === 0 && (
            <div>We didn't find any facilities near the location.</div>
          )}
        </div>

        <div className={'usa-width-two-thirds'} />
      </div>
    </>
  );
}
