import React from 'react';

export const behaviorListPageTitle = 'Types of behavioral changes';

export const BEHAVIOR_LIST_DESCRIPTION = (
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

export const BEHAVIOR_LIST_BEHAVIOR_SUBTITLES = Object.freeze({
  work: 'Behavioral changes related to work',
  health: 'Behavioral changes related to health',
  other: 'Other behavioral changes',
  unlisted: 'Other behavioral changes not listed here:',
  none: 'None',
});

export const BEHAVIOR_LIST_NONE_LABEL =
  'I didn’t experience any of these behavioral changes.';

export const BEHAVIOR_INTRO_COMBAT_DESCRIPTION = (
  <p>Placholder content for combat intro description</p>
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

/**
 * Validates the 'none' checkbox is not selected if behaviors are also selected
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */

export function validateBehaviorSelections(errors, formData) {
  // returns true at first checkbox selection
  const behaviorsSelected =
    Object.values(formData.workBehaviors || {}).some(
      selected => selected === true,
    ) ||
    Object.values(formData.healthBehaviors || {}).some(
      selected => selected === true,
    ) ||
    Object.values(formData.otherBehaviors || {}).some(
      selected => selected === true,
    );

  // returns true if text field has any input
  const unlistedProvided = Object.values(formData.unlistedBehaviors || {}).some(
    entry => !!entry,
  );

  // returns true if 'none' checkbox is selected
  const optedOut = Object.values(formData['view:optOut'] || {}).some(
    selected => selected === true,
  );

  if (optedOut && (behaviorsSelected || unlistedProvided)) {
    errors['view:optOut'].addError(
      'If you didn’t experience any of these behavioral changes, unselect the other options you selected.',
    );
  }
}
