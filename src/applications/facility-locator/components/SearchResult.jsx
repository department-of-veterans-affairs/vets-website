import React from 'react';
import PropTypes from 'prop-types';
import LocationInfoBlock from './search-results/LocationInfoBlock';
import LocationPhoneLink from './search-results/LocationPhoneLink';
import LocationDirectionsLink from './search-results/LocationDirectionsLink';

// revert to stateless component given: 19fd5178f
const SearchResult = ({ result }) => (
  <div className="facility-result" id={result.id}>
    <LocationInfoBlock location={result} from={SearchResult.name} />
    <LocationDirectionsLink location={result} from={SearchResult.name} />
    <LocationPhoneLink location={result} from={SearchResult.name} />
  </div>
);

SearchResult.propTypes = {
  result: PropTypes.object,
};

export default SearchResult;
