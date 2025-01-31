import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { ResultMapper } from './search-results-items/common/ResultMapper';

const MobileMapSearchResult = ({ mobileMapPinSelected, query }) => {
  const headerRef = useRef(null);

  return (
    <>
      {!mobileMapPinSelected && (
        <p className="vads-u-margin-y--3">
          Select a number to show information about that location.
        </p>
      )}
      {mobileMapPinSelected && (
        <div className="mobile-search-result">
          {ResultMapper(mobileMapPinSelected, query, 0, headerRef)}
        </div>
      )}
    </>
  );
};

MobileMapSearchResult.propTypes = {
  mobileMapPinSelected: PropTypes.object,
  query: PropTypes.object,
};

export default MobileMapSearchResult;
