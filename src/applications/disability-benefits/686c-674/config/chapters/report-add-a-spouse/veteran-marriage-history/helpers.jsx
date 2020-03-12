import React from 'react';

export const SpouseItemHeader = formData => (
  <legend
    className="schemaform-block-title schemaform-block-subtitle"
    id={formData.id}
  >
    {formData.id.includes('0') ? 'Your former spouse(s)' : 'Next former spouse'}
  </legend>
);
