import React from 'react';
import { ContactCrisis } from './common';

export const disabilityNameTitle = (
  <legend className="schemaform-block-title schemaform-title-underline">
    PTSD
  </legend>
);

export const introExplanationText = (
  <div>
    <p>
      Your responses will be saved as you go through these questions. If you
      need to take a break and come back to your application, your information
      will be saved.
    </p>
    <ContactCrisis />
  </div>
);

export const newPTSDFollowUpDescription = (
  <div>
    <p>
      We’ll now ask you questions about the stressful event or events related to
      your PTSD. We understand that some of the questions may be difficult to
      answer. The information you provide here will help us understand your
      situation and research your claim.
    </p>
    {introExplanationText}
  </div>
);
