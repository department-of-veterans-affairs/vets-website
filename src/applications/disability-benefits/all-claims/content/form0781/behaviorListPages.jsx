import React from 'react';
import { Link } from 'react-router';
import {
  ALL_BEHAVIOR_CHANGE_DESCRIPTIONS,
  BEHAVIOR_LIST_SECTION_SUBTITLES,
  LISTED_BEHAVIOR_TYPES_WITH_SECTION,
  MH_0781_URL_PREFIX,
} from '../../constants';

// intro page
export const behaviorPageTitle = 'Behavioral changes';

export const behaviorIntroDescription = (
  <>
    <p>
      The next few questions are about behavioral changes that happened after
      your traumatic experiences.
    </p>
    <p>
      These questions are optional. Any information you provide will help us
      understand your situation and identify evidence to support your claim. You
      only need to provide details you’re comfortable sharing.
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
      can take a break at any time. We’ll save the information you enter so you
      can finish your application later.
    </p>
  </>
);

// combat-only intro page
export const behaviorIntroCombatDescription = (
  <>
    <p>
      We’ll now ask you a few questions about the behavioral changes you
      experienced after combat events. You can choose to answer these questions
      or skip them. If we need more information, we’ll contact you.
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
  'I didn’t experience any behavioral changes after my traumatic events.';

export const conflictingBehaviorErrorMessage =
  'If you select no behavioral changes to include, unselect other behavioral changes before continuing.';

/**
 * Returns true if 'none' selected, false otherwise
 * @param {object} formData
 * @returns {boolean}
 */
function hasSelectedNoneCheckbox(formData) {
  return Object.values(formData.noBehavioralChange || {}).some(
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

  // add error message to none checkbox if conflict exists
  if (isConflicting === true) {
    errors.noBehavioralChange.addError(
      'If you select no behavioral changes to include, unselect other behavioral changes before continuing.',
    );
  }
}

/**
 * Returns an object containing the selected behavior types from the form data.
 * @param {object} formData
 * @returns {object} //example: { reassignment: true, consultations: true }
 */
export const allSelectedBehaviorTypes = formData => {
  const allBehaviorTypes = {
    ...formData.workBehaviors,
    ...formData.healthBehaviors,
    ...formData.otherBehaviors,
  };

  return Object.entries(allBehaviorTypes)
    .filter(([, value]) => value === true)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
};

/**
 * Returns an object containing the orphaned behavior type with the provided details.
 * @param {object} formData
 * @returns {object} // example: { performance: 'Changes in performance or performance evaluations', socialEconomic: 'Economic or social behavioral changes' }
 */
export function orphanedBehaviorDetails(formData) {
  const updatedSelections = allSelectedBehaviorTypes(formData);

  const existingDetails = formData.behaviorsDetails;

  const orphanedObject = {};
  if (Object.keys(updatedSelections).length === 0) {
    Object.entries(existingDetails).forEach(([behaviorType, detail]) => {
      if (!detail) {
        return; // skip if detail is empty string or undefined
      }
      const behaviorTypeDescription =
        behaviorType === 'unlisted'
          ? BEHAVIOR_LIST_SECTION_SUBTITLES.other
          : ALL_BEHAVIOR_CHANGE_DESCRIPTIONS[behaviorType];
      orphanedObject[behaviorType] = behaviorTypeDescription;
    });
  } else {
    Object.entries(existingDetails).forEach(([behaviorType, detail]) => {
      if (
        !!detail &&
        !Object.prototype.hasOwnProperty.call(updatedSelections, behaviorType)
      ) {
        const behaviorTypeDescription =
          behaviorType === 'unlisted'
            ? BEHAVIOR_LIST_SECTION_SUBTITLES.other
            : ALL_BEHAVIOR_CHANGE_DESCRIPTIONS[behaviorType];
        orphanedObject[behaviorType] = behaviorTypeDescription;
      }
    });
  }
  return orphanedObject;
}

// behavior description pages
export const behaviorDescriptionPageDescription =
  'Describe the behavioral change you experienced. (Optional)';

export const behaviorDescriptionPageHint =
  'You can tell us approximately when this change happened, whether any records exist, or anything else about the change you experienced.';

export const unlistedPageTitle = BEHAVIOR_LIST_SECTION_SUBTITLES.other;

// the unlisted description page is after all the listed behaviors
export const unlistedDescriptionPageNumber =
  Object.keys(LISTED_BEHAVIOR_TYPES_WITH_SECTION).length + 1;

export const unlistedDescriptionPageDescription =
  'Describe the other behavioral changes you experienced that were not in the list of behavioral change types provided. (Optional)';

// behavior summary page
export const behaviorSummaryPageTitle = 'Summary of behavioral changes';

function getDescriptionForBehavior(selectedBehaviors, behaviorDetails) {
  const allBehaviorDescriptions = ALL_BEHAVIOR_CHANGE_DESCRIPTIONS;

  const newObject = {};
  Object.keys(allBehaviorDescriptions).forEach(behaviorType => {
    if (behaviorType in selectedBehaviors) {
      const behaviorDescription =
        behaviorType === 'unlisted'
          ? BEHAVIOR_LIST_SECTION_SUBTITLES.other
          : allBehaviorDescriptions[behaviorType];
      newObject[behaviorDescription] =
        behaviorDetails?.[behaviorType] || 'Optional description not provided.';
    }
  });
  return newObject;
}

function behaviorSummariesList(behaviorAndDetails) {
  return (
    <>
      {Object.entries(behaviorAndDetails).map(
        ([behaviorType, details, index]) => (
          <div key={`${behaviorType}-${index}`}>
            <h4>{behaviorType}</h4>
            <p className="multiline-ellipsis-4">{details}</p>
          </div>
        ),
      )}
      <div className="vads-u-margin-top--2">
        <Link
          to={{
            pathname: `${MH_0781_URL_PREFIX}/behavior-changes-list`,
            search: '?redirect',
          }}
        >
          Edit behavioral changes
        </Link>
      </div>
    </>
  );
}

export const selectedBehaviorsWithDetails = formData => {
  return getDescriptionForBehavior(
    allSelectedBehaviorTypes(formData),
    formData.behaviorsDetails,
  );
};

export const summarizeBehaviors = formData => {
  const summarizedObject = selectedBehaviorsWithDetails(formData);
  return behaviorSummariesList(summarizedObject);
};
