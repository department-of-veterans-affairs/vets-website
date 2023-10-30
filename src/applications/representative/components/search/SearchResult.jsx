import React from 'react';
import PropTypes from 'prop-types';
import RepresentativeDirectionsLink from './RepresentativeDirectionsLink';

const SearchResult = ({
  organization,
  // type,
  addressLine1,
  addressLine2,
  phone,
  distance,
  // result,
  representative,
  // query,
  // index,
}) => {
  return (
    <>
      <div className="representative-result">
        <div>
          <strong>{distance} Mi</strong>
        </div>
        <div>
          <strong>{organization}</strong>
        </div>
        <div>
          {addressLine1}, {addressLine2}
        </div>
        <div className="primary">{phone}</div>
        <RepresentativeDirectionsLink
          representative={representative}
          from="SearchResult"
          // query={query}
        />
        {/* <div className="va-h-ruled" /> */}
      </div>
    </>
  );
};

SearchResult.propTypes = {
  addressLine1: PropTypes.string.isRequired,
  addressLine2: PropTypes.string.isRequired,
  // handleRedirect: PropTypes.func.isRequired,
  organization: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  distance: PropTypes.number.isRequired,
};

export default SearchResult;
