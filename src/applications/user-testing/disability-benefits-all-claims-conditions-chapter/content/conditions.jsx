import React from 'react';
import { format } from 'date-fns';

import { createSecondaryEnhancedDescriptionString } from './secondaryEnhanced';

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

const createSecondaryDescriptionString = causedByCondition => {
  // Just for SecondaryEnhanced demo
  if (typeof causedByCondition === 'object') {
    return createSecondaryEnhancedDescriptionString(causedByCondition);
  }

  return `caused by ${causedByCondition ||
    'a missing service-connected condition'}`;
};

const createCauseFollowUpDescriptions = item => {
  const causeFollowUpDescriptions = {
    NEW: 'caused by an injury, event, disease or exposure during my service',
    SECONDARY: createSecondaryDescriptionString(item?.causedByCondition),
    WORSENED:
      'existed before I served in the military, but got worse because of my military service',
    VA:
      'caused by an injury or event that happened when I was receiving VA care',
  };

  const cause = item?.cause;
  return causeFollowUpDescriptions[cause];
};

const formatDateString = dateString => {
  if (!dateString) {
    return '';
  }

  const [year, month, day] = dateString.split('-').map(Number);
  if (day) {
    return format(new Date(year, month - 1, day), 'MMMM d, yyyy');
  }
  if (month) {
    return format(new Date(year, month - 1), 'MMMM yyyy');
  }
  return year;
};

export const NewConditionCardDescription = item => {
  const causeFollowUpDescription = createCauseFollowUpDescriptions(item);
  const date = formatDateString(item?.conditionDate);

  return (
    <p>
      New condition
      {date && `; started ${date}`}
      {causeFollowUpDescription && `; ${causeFollowUpDescription}`}
      {(date || causeFollowUpDescription) && '.'}
    </p>
  );
};

export const RatedDisabilityCardDescription = (item, fullData) => {
  const ratingPercentage = fullData?.ratedDisabilities?.find(
    ratedDisability => ratedDisability?.name === item?.ratedDisability,
  )?.ratingPercentage;
  const date = formatDateString(item?.conditionDate);

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
