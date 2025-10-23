import React from 'react';
import { capitalizeEachWord } from '../utils';
import { NULL_CONDITION_STRING } from '../constants';

export const disabilityNameTitle = ({ formData }) => (
  <legend className="schemaform-block-title schemaform-title-underline">
    {typeof formData.condition === 'string'
      ? capitalizeEachWord(formData.condition)
      : NULL_CONDITION_STRING}
  </legend>
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
