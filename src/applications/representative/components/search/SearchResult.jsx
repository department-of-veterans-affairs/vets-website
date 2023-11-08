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
  query,
  // index,
}) => {
  return (
    <>
      <div>
        <div>
          <strong>{distance} Mi</strong>
        </div>
        <div className="vads-u-font-family--serif vads-u-padding-top--0p5">
          <strong>{organization}</strong>
        </div>
        <div className="vads-u-padding-y--1p5">
          <div>
            {addressLine1}, {addressLine2}
          </div>
          <RepresentativeDirectionsLink
            representative={representative}
            query={query}
          />
        </div>
        <div>
          <strong>Main Number: </strong>
          <va-telephone contact={phone} />
        </div>

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
