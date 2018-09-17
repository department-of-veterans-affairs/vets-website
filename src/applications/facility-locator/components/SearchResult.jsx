/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import LocationInfoBlock from './search-results/LocationInfoBlock';
import LocationPhoneLink from './search-results/LocationPhoneLink';
import LocationDirectionsLink from './search-results/LocationDirectionsLink';

// revert to stateless component given: 19fd5178f
const SearchResult = ({ result, currentLocation = null }) =>  {
  return (
    <div className="facility-result" id={result.id}>
      <LocationInfoBlock location={result} currentLocation={currentLocation}/>
      <LocationPhoneLink location={result}/>
      <LocationDirectionsLink location={result}/>
    </div>
  );
};

SearchResult.propTypes = {
  result: PropTypes.object,
};

export default SearchResult;
