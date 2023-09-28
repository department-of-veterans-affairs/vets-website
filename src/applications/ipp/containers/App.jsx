import React from 'react';

export default function App() {
  return (
    <body className="page">
      <div className="container">
        <div className="white-box">
          <br />
          <h1>In-person Identity Verification</h1>
          <div className="text">
            <p>
              Verifying your identity adds a layer of security to your Login.gov
              account. VA requires you to verify your identity to access your
              full healthcare and benefits. You may verify your identity in
              person at a VA Medical Center to ensure that this process goes
              smoothly. To verify your account, you will need:
            </p>
            <ol>
              <li>State-Issued ID or VHIC</li>
              <li>
                A confirmation case number that you will create in this
                application
              </li>
            </ol>
            <div className="wrapper">
              <button type="button" className="wide-button">
                Continue
              </button>
            </div>
            <p>
              If you decide not to verify your identity in-person, you may close
              this window at any time.
            </p>
            <br />
          </div>
        </div>
      </div>
    </body>
  );
}
