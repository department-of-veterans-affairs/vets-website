import React from 'react';
import { useSelector } from 'react-redux';

export default function InstitutionAddress() {
  const formData = useSelector(state => state.form?.data);
  const { street, street2, street3, city, state, postalCode, country } =
    formData?.institutionDetails?.institutionAddress || {};

  const hasAddress = [
    street,
    street2,
    street3,
    city,
    state,
    postalCode,
    country,
  ].some(Boolean);

  return (
    <div>
      {!hasAddress ? (
        <p>--</p>
      ) : (
        <p className="va-address-block">
          <span className="vads-u-display--block">{street}</span>
          {street2 && <span className="vads-u-display--block">{street2}</span>}
          {street3 && <span>{street3}</span>}
          <span>{city}</span>
          {city ? ',' : ''}{' '}
          <span className="vads-u-margin-right--0p25">{state}</span>
          <span>{postalCode}</span>
          <span className="vads-u-display--block">{country}</span>
        </p>
      )}
    </div>
  );
}
