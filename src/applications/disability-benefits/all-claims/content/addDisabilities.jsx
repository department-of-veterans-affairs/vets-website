import React from 'react';
import { Link } from 'react-router';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

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
    <AlertBox
      status="error"
      headline="We need you to add a disability"
      content="You need to add a new disability to claim. We can’t process your claim without a disability selected."
    />
  );
};

export const increaseAndNewAlert = ({ formContext }) => {
  // Display only after the user tries to submit with no disabilities
  if (!formContext.submitted) return null;

  const alertContent = (
    <>
      <p>
        You’ll need to add a new disability or choose a rated disability to
        claim. We can’t process your claim without a disability selected. Please
        add a new disability or choose a rated disability for increased
        compensation.
      </p>
      <Link to={`disabilities/rated-disabilities`}>
        Choose a rated disability
      </Link>
    </>
  );

  return (
    <AlertBox
      status="error"
      headline="We need you to add a disability"
      content={alertContent}
    />
  );
};
