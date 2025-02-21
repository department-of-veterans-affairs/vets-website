import React from 'react';
import { Link } from 'react-router';
import {
  BEHAVIOR_CHANGES_WORK,
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_OTHER,
} from '../../constants';

// intro page
export const behaviorPageTitle = 'Behavioral changes';

export const behaviorIntroDescription = (
  <>
    <p>
      The next few questions are about behavioral changes you experienced after
      your traumatic experiences.
    </p>
    <p>
      These questions are optional. Any information you provide will help us
      understand your situation and identify evidence to support your claim. You
      can provide only details you’re comfortable sharing.
    </p>
    <h4>Information we’ll ask you for</h4>
    <p>
      We’ll ask you for this information:
      <ul>
        <li>
          The types of behavioral changes you experienced after your traumatic
          events
        </li>
        <li>
          A description of each behavioral change, including when it happened,
          whether any records exist, and any other details you want to provide
        </li>
      </ul>
    </p>
    <h4>You can take a break at any time</h4>
    <p>
      We understand that some of the questions may be difficult to answer. You
      can take a break at any time and come back to continue your application
      later. We’ll save the information you’ve entered so far.
    </p>
  </>
);

// combat-only intro page
export const behaviorIntroCombatDescription = (
  <>
    <p>
      PLACEHOLDER The next few questions are about behavioral changes you
      experienced after your traumatic experiences
    </p>
    <p>
      PLACEHOLDER Since you said your traumatic experiences were related to
      combat only, these questions are optional. You don’t need to answer them.
      If we need more information, we’ll contact you after you submit your
      claim.
    </p>
  </>
);

// behavior list page
export const behaviorListPageTitle = 'Types of behavioral changes';

export const behaviorListDescription = (
  <>
    <p>
      Did you experience any of these behavioral changes after your traumatic
      experiences?
    </p>
    <p>
      It’s also okay if you don’t report any behavioral changes. You can skip
      this question if you don’t feel comfortable answering.
    </p>
  </>
);

export const behaviorListAdditionalInformation = (
  <va-additional-info
    class="vads-u-margin-y--3"
    trigger="Why we’re asking this question"
  >
    <div>
      <p className="vads-u-margin-top--0">
        We understand that traumatic events from your military service may not
        have been reported or documented. In these situations, the information
        you provide about your behavioral changes will help us understand your
        situation and identify evidence to support your claim.
      </p>
    </div>
  </va-additional-info>
);

export const behaviorListNoneLabel =
  'PLACEHOLDER I didn’t experience any of these behavioral changes.';

export const behaviorListValidationError = (
  <va-alert status="error" uswds>
    <p className="vads-u-font-size--base">
      You selected one or more behavioral changes. You also selected "I didn’t
      experience any behavioral changes." Revise your selection so they don’t
      conflict to continue.
    </p>
  </va-alert>
);

/**
 * Returns true if 'none' selected, false otherwise
 * @param {object} formData
 * @returns {boolean}
 */
function hasSelectedNoneCheckbox(formData) {
  return Object.values(formData['view:noneCheckbox'] || {}).some(
    selected => selected === true,
  );
}

/**
 * Returns an object with behavior section properties and boolean value if selections present within each section
 * @param {object} formData
 * @returns {object}
 */
function selectedBehaviorSections(formData) {
  const workBehaviorsSelected = Object.values(
    formData.workBehaviors || {},
  ).some(selected => selected === true);

  const healthBehaviorsSelected = Object.values(
    formData.healthBehaviors || {},
  ).some(selected => selected === true);

  const otherBehaviorsSelected = Object.values(
    formData.otherBehaviors || {},
  ).some(selected => selected === true);

  const noneSelected = hasSelectedNoneCheckbox(formData);

  return {
    workBehaviors: workBehaviorsSelected,
    healthBehaviors: healthBehaviorsSelected,
    otherBehaviors: otherBehaviorsSelected,
    none: noneSelected,
  };
}

/**
 * Returns true if any selected behavior types, false otherwise
 * @param {object} formData
 * @returns {boolean}
 */
export function hasSelectedBehaviors(formData) {
  const selections = selectedBehaviorSections(formData);
  const { workBehaviors, healthBehaviors, otherBehaviors } = selections;
  return [workBehaviors, healthBehaviors, otherBehaviors].some(
    selection => selection === true,
  );
}

/**
 * Returns true if 'none' checkbox and other behavior types are selected
 * @param {object} formData
 * @returns {boolean}
 */

export function showConflictingAlert(formData) {
  const noneSelected = hasSelectedNoneCheckbox(formData);
  const somethingSelected = hasSelectedBehaviors(formData);

  return !!(noneSelected && somethingSelected);
}

/**
 * Validates that the 'none' checkbox is not selected if behavior types are also selected
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */

export function validateBehaviorSelections(errors, formData) {
  const isConflicting = showConflictingAlert(formData);
  const selections = selectedBehaviorSections(formData);

  // add error with no message to each checked section
  if (isConflicting === true) {
    errors['view:noneCheckbox'].addError(' ');
    if (selections.workBehaviors === true) {
      errors.workBehaviors.addError(' ');
    }
    if (selections.healthBehaviors === true) {
      errors.healthBehaviors.addError(' ');
    }
    if (selections.otherBehaviors === true) {
      errors.otherBehaviors.addError(' ');
    }
  }
}

// behavior description pages
export const behaviorDescriptionPageDescription =
  'Describe the behavioral change you experienced. (Optional)';
export const unlistedDescriptionPageDescription =
  'PLACEHOLDER Describe the other behavioral changes you experienced that were not in the list of behavioral change types provided. (Optional)';

export const behaviorDescriptionPageHint =
  'You can tell us approximately when this change happened, whether any records exist, or anything else about the change you experienced.';

export const reassignmentPageTitle = BEHAVIOR_CHANGES_WORK.reassignment;

export const unlistedPageTitle = 'Other behavioral changes';

// behavior summary page
export const behaviorSummaryPageTitle = 'Summary of behavioral changes';

function getDescriptionForBehavior(behaviors, descriptions, details) {
  const newObj = {};

  Object.keys(descriptions).forEach(behaviorDescription => {
    if (behaviorDescription in behaviors) {
      newObj[behaviorDescription] =
        details[behaviorDescription] || 'Optional description not provided.';
    }
  });
  return newObj;
}

function behaviorSummariesList(obj) {
  return (
    <>
      {Object.entries(obj).map(([key, value, index]) => (
        <div key={`${key}-${index}`}>
          <h4>{key}</h4>
          <p>{value}</p>
        </div>
      ))}
      <Link
        to={{
          pathname: 'mental-health-form-0781/behavior-changes-list',
          search: '?redirect',
        }}
      >
        Edit behavioral changes
      </Link>
    </>
  );
}

export const summarizeBehaviors = formData => {
  const allBehaviorDescriptions = {
    ...BEHAVIOR_CHANGES_WORK,
    ...BEHAVIOR_CHANGES_HEALTH,
    ...BEHAVIOR_CHANGES_OTHER,
  };

  const allBehaviorTypes = {
    ...formData.workBehaviors,
    ...formData.healthBehaviors,
    ...formData.otherBehaviors,
  };

  const allSelectedBehaviorTypes = Object.entries(allBehaviorTypes)
    .filter(([, value]) => value === true)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const selectedBehaviorsWithDetails = getDescriptionForBehavior(
    allSelectedBehaviorTypes,
    allBehaviorDescriptions,
    formData.behaviorsDetails,
  );

  return behaviorSummariesList(selectedBehaviorsWithDetails);
};
