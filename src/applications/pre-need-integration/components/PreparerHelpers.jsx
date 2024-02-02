import React from 'react';

export function PreparerDetailsTitle() {
  return <h3 className="vads-u-font-size--h5">Your details</h3>;
}

export function ContactDetailsTitle() {
  return (
    <div className="preparer-contact-details-title">
      <h3 className="vads-u-font-size--h5">Your contact details</h3>
    </div>
  );
}

export function ValidateAddressTitle() {
  return (
    <div className="validate-address-title">
      <h3 className="vads-u-font-size--h5">Validate Address</h3>
    </div>
  );
}

export function PreparerDescription() {
  return (
    <div>
      <p>
        Since you’re filling out this application for someone else, first we’ll
        ask for your details. Then, we’ll ask about the person you’re filling
        out this application for (called the applicant).
      </p>
    </div>
  );
}
