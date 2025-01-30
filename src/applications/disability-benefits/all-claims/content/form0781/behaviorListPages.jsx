import React from 'react';

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

export const behaviorListNoneLabel =
  'I didn’t experience any of these behavioral changes.';

export const behaviorIntroCombatDescription = (
  <>
    <p>
      The next few questions are about behavioral changes you experienced after
      your traumatic experiences
    </p>
    <p>
      Since you said your traumatic experiences were related to combat only,
      these questions are optional. You don’t need to answer them. If we need
      more information, we’ll contact you after you submit your claim.
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

export const behaviorListValidationError = (
  <va-alert status="error" uswds>
    <p className="vads-u-font-size--base">
      You selected one or more behavioral changes. You also selected "I didn’t
      experience any behavioral changes." Revise your selection so they don’t
      don’t conflict to continue.
    </p>
  </va-alert>
);

/**
 * Validates that a required selection is made and that the 'none' checkbox is not selected if behaviors are also selected
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

  // returns true if 'none' checkbox is selected
  const optedOut = Object.values(formData['view:optOut'] || {}).some(
    selected => selected === true,
  );

  if (optedOut && behaviorsSelected) {
    // when a user has selected options and opted out
    errors['view:optOut'].addError(
      'You selected one or more behavioral changes. You also selected "I didn’t experience any behavioral changes." Revise your selection so they don’t conflict to continue.',
    );
  }
}
