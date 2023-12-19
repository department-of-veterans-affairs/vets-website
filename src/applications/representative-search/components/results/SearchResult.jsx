import React from 'react';
import PropTypes from 'prop-types';
import RepresentativeDirectionsLink from './RepresentativeDirectionsLink';
import { parsePhoneNumber } from '../../utils/phoneNumbers';

const SearchResult = ({
  officer,
  // type,
  addressLine1,
  addressLine2,
  addressLine3,
  city,
  state,
  zipCode,
  phone,
  distance,
  // result,
  representative,
  query,
  // index,
}) => {
  const addressExists =
    addressLine1 || addressLine2 || addressLine3 || city || state || zipCode;

  const { contact, extension } = parsePhoneNumber(phone);
  return (
    <>
      <div>
        {distance && (
          <div>
            <strong>{parseFloat(JSON.parse(distance).toFixed(2))} Mi</strong>
          </div>
        )}
        {officer && (
          <div className="vads-u-font-family--serif vads-u-padding-top--0p5">
            <h3>{officer}</h3>
          </div>
        )}
        {addressExists && (
          <div className="vads-u-padding-y--1p5">
            <div>
              {addressLine1}, {addressLine2}
            </div>
            <div>
              {city} {state} {zipCode}
            </div>
            <RepresentativeDirectionsLink
              representative={representative}
              query={query}
            />
          </div>
        )}
        {phone && (
          <div>
            <strong>Main Number: </strong>
            <va-telephone contact={contact} extension={extension} />
          </div>
        )}
      </div>
    </>
  );
};

SearchResult.propTypes = {
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  city: PropTypes.string,
  distance: PropTypes.number,
  officer: PropTypes.string,
  phone: PropTypes.string,
  query: PropTypes.object,
  representative: PropTypes.string,
  state: PropTypes.string,
  type: PropTypes.string,
  zipCode: PropTypes.string,
};

export default SearchResult;
