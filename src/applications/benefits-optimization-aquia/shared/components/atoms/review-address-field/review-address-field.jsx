import PropTypes from 'prop-types';
import React from 'react';

/**
 * Review field component for displaying an address in review mode.
 * Formats address components into a readable block format.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.label='Address'] - Field label
 * @param {Object} props.value - Address object
 * @param {string} [props.emptyText='Not provided'] - Text to show when empty
 * @param {boolean} [props.hideWhenEmpty=false] - Hide the field entirely when empty
 * @returns {JSX.Element|null} Review field row
 *
 * @example
 * <ReviewAddressField
 *   value={{
 *     street: '123 Main St',
 *     street2: 'Apt 4',
 *     city: 'Springfield',
 *     state: 'IL',
 *     postalCode: '62701'
 *   }}
 * />
 */
export const ReviewAddressField = ({
  label = 'Address',
  value,
  emptyText = 'Not provided',
  hideWhenEmpty = false,
}) => {
  const isEmpty =
    !value ||
    typeof value !== 'object' ||
    (!value.street && !value.city && !value.state && !value.postalCode);

  if (isEmpty && hideWhenEmpty) {
    return null;
  }

  if (isEmpty) {
    return (
      <div className="review-row">
        <dt>{label}</dt>
        <dd>{emptyText}</dd>
      </div>
    );
  }

  const {
    street,
    street2,
    street3,
    city,
    state,
    postalCode,
    country,
    militaryAddress,
  } = value;

  return (
    <div className="review-row">
      <dt>{label}</dt>
      <dd>
        <p className="va-address-block">
          {street && (
            <>
              {street}
              <br />
            </>
          )}
          {street2 && (
            <>
              {street2}
              <br />
            </>
          )}
          {street3 && (
            <>
              {street3}
              <br />
            </>
          )}
          {militaryAddress && (
            <>
              {militaryAddress}
              <br />
            </>
          )}
          {city &&
            state &&
            postalCode && (
              <>
                {city}, {state} {postalCode}
                <br />
              </>
            )}
          {country && country !== 'USA' && country}
        </p>
      </dd>
    </div>
  );
};

ReviewAddressField.propTypes = {
  emptyText: PropTypes.string,
  hideWhenEmpty: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.shape({
    city: PropTypes.string,
    country: PropTypes.string,
    militaryAddress: PropTypes.string,
    postalCode: PropTypes.string,
    state: PropTypes.string,
    street: PropTypes.string,
    street2: PropTypes.string,
    street3: PropTypes.string,
  }),
};
