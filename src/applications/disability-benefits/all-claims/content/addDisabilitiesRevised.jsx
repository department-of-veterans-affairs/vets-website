import React from 'react';
import { Link } from 'react-router';

export const addDisabilitiesInstructions = (
  <>
    <h3>Tell us the new conditions you want to claim</h3>
    <p>
      Enter the name of your condition. Then, select your condition from the
      list of possible matches.
    </p>
    <h4>What if my condition isn’t listed?</h4>
    <p>
      You can claim a condition that isn’t listed. Enter your condition,
      diagnosis, or short description of you symptoms.
    </p>
    <h4>Examples of conditions</h4>
    <ul>
      <li>Tinnitus (ringing or hissing in ears)</li>
      <li>PTSD (post-traumatic stress disorder), combat-related</li>
      <li>Hearing loss, other than tinnitus</li>
      <li>Neck strain (cervical strain)</li>
      <li>Ankylosis in knee, right</li>
      <li>Hypertension (high blood pressure)</li>
      <li>Migraines (headaches)</li>
    </ul>
    <h4>Your new conditions</h4>
  </>
);

export const newOnlyAlertRevised = ({ formContext }) => {
  // Display only after the user tries to submit with no disabilities
  if (!formContext.submitted) return null;
  return (
    <va-alert status="error" uswds>
      <h3 slot="headline">Enter a condition to submit your claim</h3>
      <p className="vads-u-font-size--base">
        You’ll need to enter a condition, diagnosis, or short description of
        your symptoms to submit your claim.
      </p>
    </va-alert>
  );
};

export const increaseAndNewAlertRevised = ({ formContext }) => {
  // Display only after the user tries to submit with no disabilities
  if (!formContext.submitted) return null;

  const alertContent = (
    <>
      <p className="vads-u-font-size--base">
        You’ll need to add a new condition or choose a rated disability to
        claim. We can’t process your claim without a disability or new condition
        selected. Please add a new condition or choose a rated disability for
        increased compensation.
      </p>
      <Link
        to={{
          pathname: 'disabilities/rated-disabilities',
          search: '?redirect',
        }}
        className="vads-u-font-size--base"
      >
        Choose a rated disability
      </Link>
    </>
  );

  return (
    <va-alert status="error" uswds>
      <h3 slot="headline">We need you to add a condition</h3>
      {alertContent}
    </va-alert>
  );
};
