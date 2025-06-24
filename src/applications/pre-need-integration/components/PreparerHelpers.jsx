import React from 'react';

export function PreparerDetailsTitle() {
  return <h3>Your details</h3>;
}

export function MailingAddressTitle() {
  return (
    <div className="preparer-contact-details-title">
      <h3>Your mailing address</h3>
    </div>
  );
}

export function ContactDetailsTitle() {
  return (
    <div className="preparer-contact-details-title">
      <h3>Your contact details</h3>
    </div>
  );
}

export function SponsorContactDetailsTitle() {
  return <h3>Sponsor mailing address</h3>;
}

export function ValidateAddressTitle({ title }) {
  return (
    <div className="validate-address-title">
      <h3>{title}</h3>
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
