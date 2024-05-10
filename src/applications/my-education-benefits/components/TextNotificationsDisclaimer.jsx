import React from 'react';
import { connect } from 'react-redux';
import { getAppData } from '../selectors/selectors';

function TextNotificationsDisclaimer() {
  return (
    <>
      <h4>What to know about text notifications</h4>
      <ul>
        <li>We’ll send you 2 messages per month.</li>
        <li>Message and data rates may apply.</li>
        <li>If you want to opt out, text STOP.</li>
        <li>If you need help, text HELP.</li>
      </ul>
      <p>
        <a
          href="https://www.va.gov/privacy-policy/digital-notifications-terms-and-conditions/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Read our text notification terms and conditions
        </a>
      </p>
      <p>
        <a
          href="https://va.gov/privacy-policy/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Read our privacy policy
        </a>
      </p>
      <p>
        <strong>Note:</strong> At this time, we can only send text messages to
        U.S. mobile phone numbers.
      </p>
    </>
  );
}

const mapStateToProps = state => getAppData(state);

export default connect(mapStateToProps)(TextNotificationsDisclaimer);
