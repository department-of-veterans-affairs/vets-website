import React from 'react';

export const eventTypesPageTitle = 'Types of traumatic events';
export const eventTypesDescription =
  'We may send your claim to a specific type of claim processor who specializes in reviewing claims related to the traumatic events you went through.';
export const eventTypesQuestion =
  'Which of these did you experience during your military service? Select all that you experienced.';
export const eventTypesHint =
  'You can tell us about a single event, or a recurring or ongoing experience.';
export const deleteMSTEvidenceModalTitle =
  'Remove sexual assault or harassment as a type of trauma you experienced?';
export const deleteMSTEvidenceModalDescripton =
  'If you choose to remove sexual assault or harassment as a type of trauma you experienced, we’ll delete information about:';
export const deleteMSTEvidenceModalContent = (
  <>
    <ul>
      <li>
        <strong>
          Indicators about claim or appeal events in your VA medical record
        </strong>
      </li>
      <li>
        <strong>
          Military incident reports filed about your traumatic events
        </strong>
      </li>
    </ul>
  </>
);
export const deletedEvidenceAlertConfirmationContent = (
  <>
    <p className="vads-u-margin-y--0">
      You’ve removed sexual assault or harassment as a type of trauma you
      experienced.
    </p>
    <p className="vads-u-margin-y--0">
      Review your traumatic events, behavioral changes and supporting documents
      to remove any information you don’t want to include.
    </p>
  </>
);
