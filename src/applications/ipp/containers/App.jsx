import React from 'react';

export default function App() {
  return (
    <body className="page">
      <div className="container">
        <div className="white-box">
          <br />
          <h1>Confirm your selection</h1>
          <div className="text">
            <p>You have chosen to verify at the following location:</p>
            <p>
              Baltimore VA Medical Center
              <br />
              10 Greene Street
              <br />
              Baltimore, MD 21201-1524
            </p>
            <p>
              Please confirm that this is a location you will be able to visit
              in the next 10 days before continuing.
            </p>
            <div className="wrapper">
              <button type="button" className="wide-button">
                Continue
              </button>
            </div>
            <div className="wrapper">
              <button
                type="button"
                className="usa-button usa-button--outline wide-button"
              >
                Back
              </button>
            </div>
            <br />
          </div>
        </div>
      </div>
    </body>
  );
}
