import React from 'react';

export const ConditionsIntroDescription = () => (
  <p>
    On the following screens, we’ll ask you about the disabilities and
    conditions you’re claiming. After you add each disability or condition,
    we’ll ask specific follow-up questions to help process your claim.
  </p>
);

export const NewConditionDescription = () => (
  <>
    <p>Add a condition below. You can add more conditions later.</p>
    <h4>If your condition isn’t listed</h4>
    <p>
      You can claim a condition that isn’t listed. Enter your condition,
      diagnosis or short description of your symptoms.
    </p>
    <h4>Examples of conditions</h4>
    <ul>
      <li>PTSD (post-traumatic stress disorder)</li>
      <li>Hearing loss</li>
      <li>Ankylosis in knee</li>
    </ul>
    <h4>Add a new condition</h4>
  </>
);

const createCauseFollowUpDescriptions = item => {
  const cause = item?.cause;

  const causeFollowUpDescriptions = {
    NEW: 'caused by an injury or exposure during my service',
    SECONDARY: `caused by ${item?.causedByCondition ||
      'an unspecified condition'}`,
    WORSENED:
      'existed before I served in the military, but got worse because of my military service',
    VA:
      'caused by an injury or event that happened when I was receiving VA care',
  };

  return causeFollowUpDescriptions[cause];
};

export const NewConditionCardDescription = (item, date) => {
  const causeFollowUpDescription = createCauseFollowUpDescriptions(item);

  return (
    <p>
      New condition;
      {date && ` started ${date};`} {causeFollowUpDescription}.
    </p>
  );
};

export const RatedDisabilityCardDescription = (item, fullData, date) => {
  const ratingPercentage = fullData?.ratedDisabilities?.find(
    ratedDisability => ratedDisability?.name === item?.ratedDisability,
  )?.ratingPercentage;

  return (
    <>
      <p>Current rating: {ratingPercentage}%</p>
      <p>
        Claim for increase
        {date && `; worsened ${date}.`}
      </p>
    </>
  );
};
