import React from 'react';
import { Link } from 'react-router';

export const autoSuggestTitle = (
  <>
    <p>
      Enter the name of your condition below and we’ll suggest some possible
      matches.{' '}
      <strong>You don’t have to choose one of the suggested conditions.</strong>
    </p>
    <p className="new-condition-description">
      If you don’t know the name of your condition or aren’t finding a match,
      you can save the condition as you entered it. We’ll help you figure out
      the name of your condition during the exam. (Shorter descriptions are
      better. For example, foot pain, back pain or hearing loss.)
    </p>
  </>
);

export const newOnlyAlert = ({ formContext }) => {
  // Display only after the user tries to submit with no disabilities
  if (!formContext.submitted) return null;
  return (
    <va-alert status="error" uswds>
      <h3 slot="headline">We need you to add a disability</h3>
      <p className="vads-u-font-size--base">
        You need to add a new disability to claim. We can’t process your claim
        without a disability selected.
      </p>
    </va-alert>
  );
};

export const increaseAndNewAlert = ({ formContext }) => {
  // Display only after the user tries to submit with no disabilities
  if (!formContext.submitted) return null;

  const alertContent = (
    <>
      <p className="vads-u-font-size--base">
        You’ll need to add a new disability or choose a rated disability to
        claim. We can’t process your claim without a disability selected. Please
        add a new disability or choose a rated disability for increased
        compensation.
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
      <h3 slot="headline">We need you to add a disability</h3>
      {alertContent}
    </va-alert>
  );
};
