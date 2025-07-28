import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import { ARRAY_PATH } from '../constants';

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

export const createSecondaryEnhancedDescriptionString = (
  causedByConditionObj,
  fullData = {},
) => {
  const { conditions = [], ratedDisabilities = [] } = fullData;

  // names that STILL exist
  const validNames = new Set([
    // new conditions that have NOT been deleted
    ...conditions
      .filter(c => c?.['view:isDeleted'] !== true)
      .map(c => c.newCondition?.toLowerCase()?.trim()),
    // rated disabilities are always valid
    ...ratedDisabilities.map(d => d.name?.toLowerCase()?.trim()),
  ]);

  // keep only keys that are true **and** still valid
  const keptKeys = Object.keys(causedByConditionObj || {}).filter(
    key =>
      causedByConditionObj[key] === true &&
      validNames.has(key.toLowerCase().trim()),
  );

  // build a readable list
  let conditionsString = '';
  if (keptKeys.length === 1) {
    const [onlyKey] = keptKeys;
    conditionsString = onlyKey;
  } else if (keptKeys.length === 2) {
    conditionsString = keptKeys.join(' and ');
  } else if (keptKeys.length > 2) {
    conditionsString = `${keptKeys
      .slice(0, -1)
      .join(', ')}, and ${keptKeys.slice(-1)}`;
  }

  return conditionsString
    ? `caused by ${conditionsString}`
    : 'cause is unknown or was removed';
};
