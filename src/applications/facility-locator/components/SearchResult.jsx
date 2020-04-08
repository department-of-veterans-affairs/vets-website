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
    {query.facilityType === 'urgent_care' &&
      query.serviceType === 'NonVAUrgentCare' && (
        <p>
          {' '}
          Before going to a clinic for urgent care, please call the facility to
          confirm that it's open and able to provide the care you need.{' '}
        </p>
      )}
  </div>
);

SearchResult.propTypes = {
  result: PropTypes.object,
};

export default SearchResult;
