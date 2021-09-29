import React from 'react';

export default function SignInDescription({ useLoginGov }) {
  const loginGovText = useLoginGov ? `Login.gov` : '';
  return (
    <div className="usa-width-one-half columns small-12">
      <div className="explanation-content vads-u-padding-left--2p5">
        <div className="vads-u-display--block">
          <h2 className="usa-font-lead medium-screen:vads-u-margin-top--0">
            One site. A lifetime of benefits and services at your fingertips.
          </h2>
        </div>
        <p>
          You spoke. We listened. VA.gov is the direct result of what you said
          you wanted most—one easy-to-use place to:
        </p>
        <ul>
          <li>Check your disability claim and appeal status</li>
          <li>
            Find out how much money you have left to pay for school or training
          </li>
          <li>
            Refill your prescriptions and communicate with your health care team
          </li>
          <li>...and more</li>
        </ul>
        <p>
          Use your existing DS Logon, My HealtheVet, {loginGovText} or ID.me
          account to sign in to access and manage your VA benefits and health
          care.
        </p>
      </div>
    </div>
  );
}
