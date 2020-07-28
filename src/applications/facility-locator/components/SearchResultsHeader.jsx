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

  const location = context.replace(', United States', '');

  return (
    <h2
      id="facility-search-results"
      className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-padding--0p5 vads-u-margin-y--1"
      style={{ 'margin-left': '12px' }}
      tabIndex="-1"
    >
      Results for &quot;
      <b>{facilityTypes[facilityType]}</b>
      &quot; near&nbsp; &quot;
      <b>{location}</b>
      &quot;
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
