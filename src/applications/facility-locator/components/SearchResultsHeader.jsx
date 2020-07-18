import PropTypes from 'prop-types';
import React from 'react';
import { facilityTypes } from '../config';

const SearchResultsHeader = ({ results, facilityType, context }) => {
  return results.length > 0 ? (
    <h2 className="search-result-title" tabIndex="-1">
      {`Results for ${facilityTypes[facilityType]} near ${context}`}
    </h2>
  ) : (
    <br />
  );
};

SearchResultsHeader.propTypes = {
  results: PropTypes.object,
  facilityType: PropTypes.string,
  context: PropTypes.string,
};

// Only re-render if the results have changed
const areEqual = (prevProps, nextProps) => {
  return nextProps.results === prevProps.results;
};

export default React.memo(SearchResultsHeader, areEqual);
