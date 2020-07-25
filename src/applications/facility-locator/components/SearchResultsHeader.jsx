import PropTypes from 'prop-types';
import React from 'react';
import { facilityTypes } from '../config';

const SearchResultsHeader = ({
  results,
  facilityType,
  context,
  inProgress,
}) => {
  if (inProgress || !results.length) {
    return <div style={{ height: '38px' }} />;
  }

  return (
    <h2
      className="vads-u-padding-left--2  vads-u-font-size--md vads-u-margin-y--1"
      tabIndex="-1"
    >
      {`Results for ${facilityTypes[facilityType]} near ${context}`}
    </h2>
  );
};

SearchResultsHeader.propTypes = {
  results: PropTypes.array,
  facilityType: PropTypes.string,
  context: PropTypes.string,
};

// Only re-render if results or inProgress props have changed
const areEqual = (prevProps, nextProps) => {
  return (
    nextProps.results === prevProps.results &&
    nextProps.inProgress === prevProps.inProgress
  );
};

export default React.memo(SearchResultsHeader, areEqual);
