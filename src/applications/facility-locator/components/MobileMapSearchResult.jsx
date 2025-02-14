import React from 'react';
import PropTypes from 'prop-types';
import { ResultMapper } from './search-results-items/common/ResultMapper';
import NoResultsMessage from './NoResultsMessage';

const MobileMapSearchResult = ({
  mobileMapPinSelected,
  query,
  searchResultMessageRef,
}) => {
  const validSearch = !!query?.searchString;

  if (!validSearch) {
    return (
      <NoResultsMessage
        isMobileListView={false}
        resultRef={searchResultMessageRef}
      />
    );
  }

  return (
    <>
      {!mobileMapPinSelected ? (
        <p className="vads-u-margin-y--3">
          Select a number to show information about that location.
        </p>
      ) : (
        <div className="mobile-search-result">
          {ResultMapper(mobileMapPinSelected, query, 0, true)}
        </div>
      )}
    </>
  );
};

MobileMapSearchResult.propTypes = {
  mobileMapPinSelected: PropTypes.object,
  query: PropTypes.object,
  searchResultMessageRef: PropTypes.object,
};

export default MobileMapSearchResult;
