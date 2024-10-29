import React from 'react';

export const addConditionsInstructions = (
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

export const duplicateAlert = () => {
  return (
    <va-alert status="error" uswds>
      <h3 slot="headline">Duplicate</h3>
      <p className="vads-u-font-size--base">
        You’ve already added this condition to your claim.
      </p>
    </va-alert>
  );
};
