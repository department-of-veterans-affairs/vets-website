import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { resultMapper } from '../utils/resultMapper';

const MobileMapSearchResult = ({ mobileMapPinSelected, query }) => {
  const headerRef = useRef(null);

  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef.current);
      }
    },
    [headerRef],
  );

  return (
    <>
      {!mobileMapPinSelected && (
        <p className="vads-u-margin-y--3">
          Select a number to show information about that location.
        </p>
      )}
      {mobileMapPinSelected && (
        <div className="mobile-search-result">
          {resultMapper(mobileMapPinSelected, query, 0)}
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
