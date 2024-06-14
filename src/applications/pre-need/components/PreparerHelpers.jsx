import React from 'react';

export function PreparerDetailsTitle() {
  return <h3 className="vads-u-font-size--h5">Preparer details</h3>;
}

export function ContactDetailsTitle() {
  return (
    <div className="preparer-contact-details-title">
      <h3 className="vads-u-font-size--h5">Preparer contact details</h3>
    </div>
  );
}

export function PreparerDescription() {
  return (
    <div>
      <p>
        Since you indicated you're preparing the application, you'll need to
        provide your details.
      </p>
    </div>
  );
}
