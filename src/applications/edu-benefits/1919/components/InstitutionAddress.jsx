import React from 'react';
import { useSelector } from 'react-redux';

export default function InstitutionAddress() {
  const formData = useSelector(state => state.form?.data);
  const { address1, address2, address3, city, state, zip, country } =
    formData?.institutionDetails?.address || {};

  return (
    <div>
      {!state ? (
        <p>--</p>
      ) : (
        <p className="va-address-block">
          <span className="vads-u-display--block">{address1}</span>
          {address2 && (
            <span className="vads-u-display--block">{address2}</span>
          )}
          {address3 && <span>{address3}</span>}
          <span>{city}</span>
          {city ? ',' : ''}{' '}
          <span className="vads-u-margin-right--0p25">{state}</span>
          <span>{zip}</span>
          <span className="vads-u-display--block">{country}</span>
        </p>
      )}
    </div>
  );
}
