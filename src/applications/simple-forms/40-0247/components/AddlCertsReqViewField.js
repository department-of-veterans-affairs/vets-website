import React from 'react';

export default function AddlCertsReqViewField({ formData }) {
  return (
    <>
      <div className="vads-u-padding--2">
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h5">
          Additional request
        </h3>
        <p className="vads-u-font-weight--bold vads-u-margin-y--0p5">
          Address:
        </p>
        <p className="vads-u-margin-y--0">
          {formData.address.street}
          <br />
          {!!formData.address.street2 && (
            <>
              <span>{formData.street2}</span>
              <br />
            </>
          )}
          {formData.address.city}, {formData.address.state}{' '}
          {formData.address.postalCode}
        </p>
        <p className="vads-u-font-weight--bold vads-u-margin-y--0p5">
          Quantity:
        </p>
        <p className="vads-u-margin-y--0">{formData.quantity}</p>
      </div>
    </>
  );
}
