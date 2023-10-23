import React from 'react';

export default function LandingScreen({ onPageChange }) {
  return (
    <body className="page">
      <div className="container">
        <div className="white-box">
          <br />
          <h1>In-person Identity Verification</h1>
          <div className="text">
            <p>
              You can verify your identity in-person at a participating VA
              Medical Center.
            </p>
            <p>You will need to bring following items with you:</p>
            <ol>
              <li>
                <b> Your VHIC or state-issued ID</b>
              </li>
              {/* <p> At this time, only your Veteran Health Identification Card (VHIC) or the following state-issued identification is accepted:</p>
                <ul>
                    <li>Driver’s license from all 50 states, the District of Columbia (DC), and other US territories (Guam, US Virgin Islands, American Samoa, Mariana Islands and Puerto Rico)</li>
                    <li>A non-driver’s license state-issued ID card
                        <ul>
                            <li>Your ID must not be expired</li>
                        </ul>
                    </li>
                </ul> */}
              <li>
                <b> Confirmation Case number</b>
              </li>
              {/* <p>Once you complete the steps on Login.gov, we’ll generate a confirmation case number that will be valid for 10 days. You can write this number down, print the email, or show the email from your mobile device. If you go to a VA Medical Center after the deadline, your information will not be saved and you will need to restart the process.</p> */}
            </ol>
            <div className="wrapper">
              <button
                type="button"
                className="usa-button mo-full-width-btn"
                onClick={() => onPageChange(2)}
              >
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
