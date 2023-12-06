import PropTypes from 'prop-types';
import React from 'react';

const getField = (formData, possibilities) =>
  possibilities.reduce((value, field) => {
    if (value === null && formData[field]) {
      return formData[field];
    }
    return value;
  }, null);

const addLine = line => line && [line, <br key={line} />];

const AddressViewField = ({ formData }) => {
  // unchanged address variable names
  const { city, state, postalCode, country } = formData;
  // this should cover all current address use cases
  // street, line2, line3, postalCode = platform address schema
  // addressLine1, addressLine2, addressLine3 = 526 & HLR
  // zipCode = multiple forms
  const street = getField(formData, ['street', 'addressLine1']);
  const street2 = getField(formData, ['line2', 'street2', 'addressLine2']);
  const street3 = getField(formData, ['line3', 'street3', 'addressLine3']);
  const internationalPostalCode = getField(formData, [
    'internationalPostalCode',
  ]);
  const province = getField(formData, ['province']);

  const getAddressFormat = () => {
    if (country) {
      return country === 'United States' ? 'domestic' : 'international';
    }
    return undefined;
  };

  const addressFormat = getAddressFormat();

  /* eslint-disable no-unused-vars */
  // using destructuring to remove view:livesOnMilitaryBaseInfo prop
  const {
    'view:livesOnMilitaryBaseInfo': removed,
    ...alteredAddress
  } = formData;
  /* eslint-enable no-unused-vars */

  const isAddressMissing = Object.values(alteredAddress).every(prop => !prop);
  const isBaseAddressDataValid = street && country && city;
  const isDomesticAddressValid =
    addressFormat === 'domestic' && state && postalCode;
  const isInternationalAddressValid =
    addressFormat === 'international' && province && internationalPostalCode;

  let postalString = '';
  if (postalCode) {
    const lastChunk = postalCode.length > 5 ? `-${postalCode.slice(5)}` : '';
    postalString = `${postalCode.slice(0, 5)}${lastChunk}`;
  } else if (internationalPostalCode) {
    const lastChunk =
      internationalPostalCode.length > 5
        ? `-${internationalPostalCode.slice(5)}`
        : '';
    postalString = `${internationalPostalCode.slice(0, 5)}${lastChunk}`;
  }

  return (
    <>
      {!isAddressMissing && (
        <div className="vads-u-border-left--7px vads-u-border-color--primary">
          <p className="vads-u-margin-left--2 vads-u-margin-top--0 dd-privacy-mask">
            {isBaseAddressDataValid && (
              <>
                {addLine(street)}
                {addLine(street2)}
                {addLine(street3)}
                {isDomesticAddressValid && `${city}, ${state} ${postalString}`}
                {isInternationalAddressValid &&
                  `${city}, ${province} ${internationalPostalCode}`}
                <span className="vads-u-display--block">{country}</span>
              </>
            )}
          </p>
        </div>
      )}

      {isAddressMissing && (
        <p>
          Please provide a temporary address if you want us to ship your order
          to another location, like a relative’s house or a vacation home.
        </p>
      )}
    </>
  );
};

AddressViewField.defaultProps = {
  formData: {},
};

AddressViewField.propTypes = {
  formData: PropTypes.shape({
    country: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,

    street: PropTypes.string,
    street2: PropTypes.string,
    street3: PropTypes.string,

    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    addressLine3: PropTypes.string,

    postalCode: PropTypes.string,
    zipCode: PropTypes.string,
  }),
};

export default AddressViewField;
