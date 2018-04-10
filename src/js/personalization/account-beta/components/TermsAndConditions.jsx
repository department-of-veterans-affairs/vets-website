import React from 'react';

export default function TermsAndConditions({ healthTermsCurrent, openModal }) {
  let content = null;

  if (healthTermsCurrent) {
    content = (
      <p>You have accepted the latest health terms and conditions for this site.</p>
    );
  } else {
    content = (
      <p>In order to refill your prescriptions, message your health care team, and get your VA health records, you need to accept the <a onClick={openModal}>Terms and Conditions for Health Tools</a>.</p>
    );
  }

  return (
    <div>
      <h4>Terms and conditions</h4>
      {content}
    </div>
  );
}
