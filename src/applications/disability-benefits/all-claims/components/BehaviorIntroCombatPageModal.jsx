import React from 'react';
import { summarizeBehaviors } from '../content/form0781/behaviorListPages';

export const BehaviorIntroCombatModal = (formData) => {


  const summarized = summarizeBehaviors(formData);

  console.log('summarized', summarized);

  // const allBehaviorTypes = {
  //   ...formData.workBehaviors,
  //   ...formData.healthBehaviors,
  //   ...formData.otherBehaviors,
  // };

  const allSelectedBehaviorTypes = Object.entries(allBehaviorTypes)
    .filter(([, value]) => value === true)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const behaviors = Object.keys(ALL_BEHAVIOR_CHANGE_DESCRIPTIONS).map(
    behaviorType => {
      if (behaviorType in allSelectedBehaviorTypes) {
        return behaviorType === 'unlisted'
          ? BEHAVIOR_LIST_SECTION_SUBTITLES.other
          : ALL_BEHAVIOR_CHANGE_DESCRIPTIONS[behaviorType];
      }

      // TODO: remove need for this?
      return null;
    },
  );

  // Clean this all up
  const describedBehaviors = behaviors.filter(element => element !== null);
  console.log("Described Behaviors", describedBehaviors)

  const describedBehaviorsCount = describedBehaviors.length;

  const firstThreeBehaviors = describedBehaviors.slice(0, 3);

  console.log("first three behaviors", firstThreeBehaviors)

  const remainingBehaviors = describedBehaviorsCount - 3;

  const behaviorsRemaining = (
    <li>
      And, <b>{remainingBehaviors} other behavioral changes</b>
    </li>
  );

  const behaviorRemaining = (
    <li>
      And, <b>1 other behavioral change</b>
    </li>
  );

  const listRemainingBehaviors =
    remainingBehaviors > 1 ? behaviorsRemaining : behaviorRemaining;

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

        {remainingBehaviors > 0 && listRemainingBehaviors}
      </ul>
      <p>
        <b>Do you want to skip questions about behavioral changes?</b>
      </p>
    </>
  );
};
