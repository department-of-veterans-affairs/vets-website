import React from 'react';
import { newPTSDFollowUpDescription } from '../content/newPTSDFollowUp';

export const disabilityNameTitle = () => (
  <legend className="schemaform-block-title schemaform-title-underline">
    PTSD
  </legend>
);

export const uiSchema = {
  'ui:title': disabilityNameTitle,
  'ui:description': newPTSDFollowUpDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};
