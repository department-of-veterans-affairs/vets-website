import React from 'react';

export default function MailingAddressReviewField({ formData }) {
  const {
    city,
    country,
    postalCode,
    state,
    street,
    street2,
  } = formData.address;

  return (
    <>
      <div className="review-row">
        <dt>Country</dt>
        <dd>{country}</dd>
      </div>
      <div className="review-row">
        <dt>Mailing addresss</dt>
        <dd>
          {street} {street2 && `${street2}`}
          <br />
          {city}, {state} {postalCode}
        </dd>
      </div>
    </>
  );
}
