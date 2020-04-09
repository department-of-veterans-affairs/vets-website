import React from 'react';
import PropTypes from 'prop-types';
import LocationInfoBlock from './search-results/LocationInfoBlock';
import LocationPhoneLink from './search-results/LocationPhoneLink';
import LocationDirectionsLink from './search-results/LocationDirectionsLink';
import LocationAddress from './search-results/LocationAddress';

// revert to stateless component given: 19fd5178f
const SearchResult = ({ result, query }) => (
  <li className="facility-result" id={result.id}>
    <dl>
      <LocationInfoBlock
        location={result}
        from={'SearchResult'}
        query={query}
      />
      <LocationAddress location={result} />
      <LocationDirectionsLink
        location={result}
        from={'SearchResult'}
        query={query}
      />
      <LocationPhoneLink
        location={result}
        from={'SearchResult'}
        query={query}
      />
      {query.facilityType === 'urgent_care' &&
        query.serviceType === 'NonVAUrgentCare' && (
          <dd>
            {' '}
            Before going to a clinic for urgent care, please call the facility
            to confirm that it's open and able to provide the care you need.{' '}
          </dd>
        )}
    </dl>
  </li>
);

SearchResult.propTypes = {
  result: PropTypes.object,
};

export default SearchResult;
