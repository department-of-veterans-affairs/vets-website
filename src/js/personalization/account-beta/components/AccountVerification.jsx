import React from 'react';

export default function AccountVerification({ accountType }) {
  let content = null;

  if (accountType !== 3) {
    content = (
      <div>
        <p>Verify your identity to access more services your may be eligible for.<br/>
          <a className="usa-button-primary" href="/verify?next=/profile">Verify identity</a>
        </p>
      </div>
    );
  } else {
    content = <p><i className="fa fa-check-circle"/> Your account has been verified.</p>;
  }

  return (
    <div>
      <h4>Account verification</h4>
      {content}
    </div>
  );
}
