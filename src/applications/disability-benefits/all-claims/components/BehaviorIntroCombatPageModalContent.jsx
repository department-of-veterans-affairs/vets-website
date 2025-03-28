import React from 'react';

import { ALL_BEHAVIOR_CHANGE_DESCRIPTIONS } from '../constants';

// TODO DOC
export const BehaviorIntroCombatPageModalContent = ({ formData }) => {
  const allBehaviors = {
    ...formData.workBehaviors,
    ...formData.healthBehaviors,
    ...formData.otherBehaviors,
  };

  const selectedBehaviors = Object.keys(allBehaviors).filter(
    k => allBehaviors[k] === true,
  );

  const behaviorDescriptions = selectedBehaviors.map(
    behaviorName => ALL_BEHAVIOR_CHANGE_DESCRIPTIONS[behaviorName],
  );

  const describedBehaviorsCount = behaviorDescriptions.length;
  const firstThreeBehaviors = behaviorDescriptions.slice(0, 3);

  const displayRemainingBehaviors = () => {
    if (describedBehaviorsCount === 4) {
      return <li key={4}>{behaviorDescriptions[3]}</li>;
    }

    return (
      <li key={4}>
        And, <b>{describedBehaviorsCount - 3} other behavioral changes</b>
      </li>
    );
  };

  return (
    <>
      <p>
        <b>What to know: </b>
        If you change to skip questions about behavioral changes, we’ll remove
        information you provided about behavioral changes, including:
      </p>
      <ul>
        {firstThreeBehaviors.map((behaviorDescription, i) => (
          <li key={i}>
            <b>{behaviorDescription}</b>
          </li>
        ))}

        {displayRemainingBehaviors()}
      </ul>
      <p>
        <b>Do you want to skip questions about behavioral changes?</b>
      </p>
    </>
  );
};
