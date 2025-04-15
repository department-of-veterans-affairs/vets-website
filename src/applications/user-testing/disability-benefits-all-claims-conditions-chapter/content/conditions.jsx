import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import { ARRAY_PATH } from '../constants';

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

export const SecondaryEnhancedNotListedAlert = () => {
  const formData = useSelector(state => state.form.data);
  const currentIndex = getArrayIndexFromPathName();
  const newCondition = formData?.[ARRAY_PATH]?.[currentIndex]?.newCondition;
  const capitalNewCondition =
    newCondition.charAt(0).toUpperCase() + newCondition.slice(1);
  const demoLabel = window.location.pathname
    .split('conditions-')[1]
    ?.split('/')[0];
  const targetIndex = formData?.[ARRAY_PATH]?.length;

  return (
    <va-alert status="warning">
      <p>
        Tell us the service-connected disability or condition that caused{' '}
        {newCondition}. You may add it now and your progress will be saved.{' '}
        {capitalNewCondition} will be marked as incomplete until that condition
        is added.
      </p>
      <Link
        to={`conditions-${demoLabel}/${targetIndex}/new-condition?add=true`}
      >
        Add new condition now
      </Link>
    </va-alert>
  );
};

export const SecondaryEnhancedOptionsConflictingAlert = () => (
  <va-alert status="error">
    <p>
      You selected "My condition is not listed" along with one or more
      conditions. Revise your selection so they don’t conflict to continue.
    </p>
  </va-alert>
);

const createSecondaryEnhancedDescriptionString = causedByCondition => {
  const conditions = Object.keys(causedByCondition || {}).filter(
    key => causedByCondition[key],
  );

  let conditionsString = '';

  if (conditions.length === 1) {
    const [condition] = conditions;
    conditionsString = condition;
  } else if (conditions.length === 2) {
    conditionsString = conditions.join(' and ');
  } else if (conditions.length > 2) {
    conditionsString = `${conditions.slice(0, -1).join(', ')}, and ${
      conditions[conditions.length - 1]
    }`;
  }

  return `caused by ${conditionsString ||
    'a missing service-connected condition'}`;
};

const createSecondaryDescriptionString = causedByCondition => {
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

export const NewConditionCardDescription = (item, date) => {
  const causeFollowUpDescription = createCauseFollowUpDescriptions(item);

  return (
    <p>
      New condition
      {date && `; started ${date}`}
      {causeFollowUpDescription && `; ${causeFollowUpDescription}`}
      {(date || causeFollowUpDescription) && '.'}
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
