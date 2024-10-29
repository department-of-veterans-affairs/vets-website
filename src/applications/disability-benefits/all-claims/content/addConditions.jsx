import React from 'react';

export const ConditionInstructions = (
  <>
    <p>Enter one condition below. You can add more conditions later.</p>
    <h4>If your conditions aren’t listed</h4>
    <p>
      You can claim a condition that isn’t listed. Enter your condition,
      diagnosis, or short description of your symptoms.
    </p>
    <h4>Examples of conditions</h4>
    <ul>
      <li>Tinnitus (ringing or hissing in ears)</li>
      <li>PTSD (post-traumatic stress disorder)</li>
      <li>Hearing loss</li>
      <li>Neck strain (cervical strain)</li>
      <li>Ankylosis in knee, right</li>
      <li>Hypertension (high blood pressure)</li>
      <li>Migraines (headaches)</li>
    </ul>
  </>
);

export const DuplicateAlert = () => (
  <va-alert status="error" uswds>
    <h3 slot="headline">Duplicate</h3>
    <p className="vads-u-font-size--base">
      You’ve already added this condition to your claim.
    </p>
  </va-alert>
);

export const ServiceConnectedDisabilityDescription = () => (
  <va-additional-info trigger="What does service-connected disability mean?">
    <p>
      To be eligible for service-connected disability benefits, you’ll need to
      show that your disability was caused by an event, injury, or disease
      during your military service. You’ll need to show your condition is linked
      to your service by submitting evidence, such as medical reports or lay
      statements, with your claim. We may ask you to have a claim exam if you
      don’t submit evidence or if we need more information to decide your claim.
    </p>
  </va-additional-info>
);
