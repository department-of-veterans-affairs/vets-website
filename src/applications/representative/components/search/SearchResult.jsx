import React from 'react';
import PropTypes from 'prop-types';

const SearchResult = ({
  organization,
  // type,
  addressLine1,
  addressLine2,
  phone,
  distance,
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
        <div className="primary">Get directions on Google Maps</div>
        {/* <div className="va-h-ruled" /> */}
        <hr styling={{ borderTop: '3px solid black' }} />
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
