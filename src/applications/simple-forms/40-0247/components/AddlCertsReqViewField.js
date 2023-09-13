import React from 'react';

export default function AddlCertsReqViewField({ formData }) {
  return (
    <div className="vads-u-padding--2">
      <div>
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h5">
          Additional request
        </h3>
        <dt className="vads-u-font-weight--bold">Address:</dt>
        <dd>
          {formData.address.street}
          <br />
          {!!formData.address.street2 && (
            <>
              <span>formData.street2</span>
              <br />
            </>
          )}
          {formData.address.city}, {formData.address.state}{' '}
          {formData.address.postalCode}
        </dd>
      </div>
      <dt className="vads-u-margin-top-2 vads-u-font-weight--bold">
        Quantity:
      </dt>
      <dd>{formData.quantity}</dd>
    </div>
  );
}
