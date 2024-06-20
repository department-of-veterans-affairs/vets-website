import React from 'react';
import PropTypes from 'prop-types';

const SaveTimeSipAlert = ({ sipIntro }) => (
  <va-alert status="info" data-testid="hca-save-time-alert" uswds>
    <h2 slot="headline">
      Sign in now to save time and save your work in progress
    </h2>
    <p>Here’s how signing in now helps you:</p>
    <ul>
      <li>We can fill in some of your information for you to save you time.</li>
      <li>
        You can save your work in progress. You’ll have 60 days from when you
        start or make updates to your application to come back and finish it.
      </li>
    </ul>
    <p>
      <strong>Note:</strong> You can sign in after you start your application.
      But you’ll lose any information you already filled in.
    </p>
    {sipIntro}
  </va-alert>
);

SaveTimeSipAlert.propTypes = {
  sipIntro: PropTypes.element,
};

export default SaveTimeSipAlert;
