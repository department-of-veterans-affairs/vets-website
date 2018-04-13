import React from 'react';
import { mfa } from '../../../login/utils/helpers';

export default function MultifactorMessage({ multifactor }) {
  if (multifactor) {
    return (
      <div>
        <h4>Account security</h4>
        <p><i className="fa fa-check-circle"/> You've added an extra layer of security to your account with 2-factor authentication.</p>
      </div>
    );
  }

  return (
    <div>
      <h4>Want to make your account more secure?</h4>
      <p><i className="fa fa-check-circle"/> Add an extra layer of security (called 2-factor authentication). This helps to make sure only you can access your account-even if someone gets your password.</p>;
      <button className="usa-button-primary" onClick={mfa}>Secure Your Account</button>
    </div>
  );
}
