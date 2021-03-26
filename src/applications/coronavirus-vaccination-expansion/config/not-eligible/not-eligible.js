import React from 'react';
import { notEligible } from '../schema-imports';

const notEligibleText = () => {
  return (
    <>
      <p>You are not eligible</p>
    </>
  );
};

export const schema = {
  notEligible,
};

export const uiSchema = {
  notEligible: {
    eligibility: {
      'ui:widget': notEligibleText,
    },
  },
};
