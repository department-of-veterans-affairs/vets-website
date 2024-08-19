import React from 'react';

export const vhaNotificationDescription = (
  <>
    <h3>
      Option to add indicator of certain upcoming claim and appeal events to
      your VA medical record
    </h3>
    <p>
      If you’re enrolled or registered in VA health care and you’re filing a
      claim related to Military Sexual Trauma (MST), you have the option to
      allow us to add an indicator (also known as a notification) to your VA
      medical record when certain claim and appeal events are happening soon.
      This indicator will only show that certain claim and appeal events are
      happening soon. It won’t show any other details specific to your claim.
    </p>
    <p>
      If you give us permission, we’ll note in your medical record when one of
      these events happens:
    </p>
    <ul>
      <li>
        We’ve submitted a request to schedule a claim exam (also known as a
        compensation and pension, or C&P, exam)
      </li>
      <li>We’ve made a decision on your claim</li>
      <li>We’ve scheduled a hearing before the Board of Veterans' Appeals</li>
    </ul>
    <p>
      Your VA health care providers may review the indicator in your medical
      record. The indicator won’t identify your claim as MST-related. But since
      we only offer this option for MST-related claims, providers who review it
      may know that your claim is related to MST.
    </p>
    <p>
      You can always choose to tell a health care provider about these claim and
      appeal events yourself, even if you don’t give us permission to add an
      indicator to your medical record.
    </p>
  </>
);

export const vhaNotificationLabel =
  'Do you give us permission to add an indicator about claim or appeal events to your VA medical record?';

export const vhaNotificationHint =
  'Your answer won’t affect the status or decision for your claim. If you skip this question, we won’t add an indicator to your VA medical record.';

export const vhaNotificationChoices = {
  yes: 'Yes',
  no: 'No',
  revoke:
    'I gave permission in the past, but I want to revoke (or cancel) my permission',
  notEnrolled: 'I’m not enrolled or registered in VA health care',
};
