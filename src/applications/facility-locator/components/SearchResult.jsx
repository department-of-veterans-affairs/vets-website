import React from 'react';
import PropTypes from 'prop-types';
import LocationInfoBlock from './search-results-items/common/LocationInfoBlock';
import LocationPhoneLink from './search-results-items/common/LocationPhoneLink';
import LocationDirectionsLink from './search-results-items/common/LocationDirectionsLink';
import { CLINIC_URGENTCARE_SERVICE, LocationType } from '../constants';

export const urgentCareCall = query => {
  const content = () => (
    <p>
      {' '}
      Before going to a clinic for urgent care, please call the facility to
      confirm that it’s open and able to provide the care you need.{' '}
    </p>
  );

  if (
    query.facilityType === LocationType.URGENT_CARE &&
    query.serviceType === 'NonVAUrgentCare'
  ) {
    return content();
  }
  if (
    query.facilityType === LocationType.CC_PROVIDER &&
    query.serviceType === CLINIC_URGENTCARE_SERVICE
  ) {
    return content();
  }

  return null;
};

const SearchResult = ({ result, query }) => (
  <div className="facility-result" id={result.id}>
    <LocationInfoBlock location={result} from="SearchResult" query={query} />
    <LocationDirectionsLink
      location={result}
      from="SearchResult"
      query={query}
    />
    <LocationPhoneLink location={result} from="SearchResult" query={query} />
    {urgentCareCall(query)}
  </div>
);

SearchResult.propTypes = {
  result: PropTypes.object,
};

export default SearchResult;
