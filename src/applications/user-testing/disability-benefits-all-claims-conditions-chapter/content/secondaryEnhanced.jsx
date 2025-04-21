import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
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

export const createSecondaryEnhancedDescriptionString = causedByCondition => {
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
