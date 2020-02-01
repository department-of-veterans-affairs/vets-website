import React from 'react';
import PropTypes from 'prop-types';
import LocationInfoBlock from './search-results/LocationInfoBlock';
import LocationPhoneLink from './search-results/LocationPhoneLink';
import LocationDirectionsLink from './search-results/LocationDirectionsLink';

// revert to stateless component given: 19fd5178f
const SearchResult = ({ result, query }) => (
  <div className="facility-result" id={result.id}>
    <LocationInfoBlock location={result} from={'SearchResult'} query={query} />
    <LocationDirectionsLink
      location={result}
      from={'SearchResult'}
      query={query}
    />
    <LocationPhoneLink location={result} from={'SearchResult'} query={query} />
  </div>
);

SearchResult.propTypes = {
  result: PropTypes.object,
};

export default SearchResult;
