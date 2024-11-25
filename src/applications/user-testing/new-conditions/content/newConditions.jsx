import React from 'react';

export const conditionInstructions = (
  <>
    <p>Add a condition below. You can add more conditions later.</p>
    <h4>If your condition isn’t listed</h4>
    <p>
      You can claim a condition that isn’t listed. Enter your condition,
      diagnosis or short description of your symptoms.
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
    <h4>Add a new condition</h4>
  </>
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
