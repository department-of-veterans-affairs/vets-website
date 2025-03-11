import React from 'react';
import PropTypes from 'prop-types';

const NoResultsMessage = ({ isMobileListView, resultRef }) => {
  // The ResultsList component is shown in the "View List" tab on mobile
  // The design specifies a different error treatment for that tab specifically
  // but the mobile map view has the same treatment as desktop
  if (isMobileListView) {
    return (
      <p
        data-testid="no-results-mobile-list-view"
        className="vads-u-margin-top--2 mobile-lg:vads-u-margin-top--0 vads-u-margin-bottom--4 vads-u-margin-x--1 mobile-lg:vads-u-margin-x--0"
      >
        Search for something else or in a different area. Try entering a
        different location, facility type, or service type.
      </p>
    );
  }

  return (
    <div
      data-testid="no-results-message"
      className="search-result-title vads-u-margin-y--3 mobile-lg:vads-u-margin-y--0"
      ref={resultRef}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <p className="vads-u-margin-top--0">
        Try searching for something else or in a different area.
      </p>
      <p>
        <strong>Suggestions:</strong>
      </p>
      <ul className="vads-u-margin-y--1p5">
        <li>Zoom out to view larger area of the map</li>
        <li>Move the map to a different area</li>
        <li>Enter a different location, facility type, or service type</li>
      </ul>
    </div>
  );
};

NoResultsMessage.propTypes = {
  isMobileListView: PropTypes.bool,
  resultRef: PropTypes.any,
};

export default NoResultsMessage;
