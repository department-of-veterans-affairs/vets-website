import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import SearchResult from './SearchResult';

const ResultsList = () => {
  const searchResultTitle = useRef();

  const searchResult = useSelector(state => state.searchResult);
  const searchQuery = useSelector(state => state.searchQuery);

  const { searchResults } = searchResult;
  const { inProgress } = searchQuery;

  useEffect(
    () => {
      focusElement(searchResultTitle.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchResults, inProgress],
  );

  return (
    <>
      <div className="representative-results-list">
        {searchResults.length ? <hr /> : null}
        {searchResults?.map((result, index) => {
          return (
            <div key={index} className="vads-u-margin-bottom--4">
              <SearchResult
                officer={result.attributes.fullName || result.attributes.name}
                reports={result.reports}
                type={result.type}
                addressLine1={result.attributes.addressLine1}
                addressLine2={result.attributes.addressLine2}
                addressLine3={result.attributes.addressLine3}
                city={result.attributes.city}
                stateCode={result.attributes.stateCode}
                zipCode={result.attributes.zipCode}
                phone={result.attributes.phone}
                email={result.attributes.email}
                distance={result.attributes.distance}
                associatedOrgs={result.attributes.organizationNames}
                representative={result}
                representativeId={result.id}
                index={index}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ResultsList;
