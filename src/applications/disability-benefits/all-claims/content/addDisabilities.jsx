import React from 'react';
import { Link } from 'react-router';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const autoSuggestTitle = (
  <>
    <p>
      If you know the name of your condition, you can enter it below. If you’re
      not sure of the name, you can enter what you want and we’ll suggest a list
      of conditions. (When entering a condition name, we recommend you use
      shorter descriptions. For example, foot pain, back pain, or hearing loss.)
    </p>
    You don’t have to choose one of the suggested conditions.
  </>
);

export const descriptionInfo = (
  <div>
    <AdditionalInfo triggerText="What if I don’t know the name of my condition?">
      <p>
        If you don’t know the name of your condition or aren’t finding a match
        from the list, enter your symptoms and we’ll help you figure out the
        name of your condition during the exam process.
      </p>
      <p>Shorter descriptions are better. For example:</p>
      <ul>
        <li>My knee hurts when I walk.</li>
        <li>I have trouble hearing when other people talk.</li>
        <li>My doctor says my cancer may be related to my service.</li>
      </ul>
    </AdditionalInfo>
  </div>
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
