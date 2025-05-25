import React from 'react';
import { useSelector } from 'react-redux';

export default function InstitutionAddress() {
  const formData = useSelector(state => state.form?.data);
  const address1 = formData?.institutionDetails?.address?.address1;
  const address2 = formData?.institutionDetails?.address?.address2;
  const address3 = formData?.institutionDetails?.address?.address3;
  const city = formData?.institutionDetails?.address?.city;
  const state = formData?.institutionDetails?.address?.state;
  const zip = formData?.institutionDetails?.address?.zip;
  const country = formData?.institutionDetails?.address?.country;

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
