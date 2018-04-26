import React from 'react';

export default function TermsAndConditions({ healthTermsCurrent, openModal }) {
  let content = null;

  if (healthTermsCurrent) {
    content = (
      <p><i className="fa fa-check-circle"/> You've accepted the latest terms and conditions for using this site's health tools.</p>
    );
  } else {
    content = (
      <p>Want to use Vets.gov to refill your VA prescriptions, communicate with your health care team, or get your VA health record? You'll need to accept the latest terms and conditions for using this site's health tools.<br/>
        <a onClick={openModal}>Read the terms and conditions.</a>
      </p>
    );
  }

  return (
    <div>
      <h4>Terms and conditions</h4>
      {content}
    </div>
  );
}
