import React from 'react';
import { PtsdNameTitle } from '../content/ptsdClassification';

const conclusionDescription = (
  <div>
    <p>
      Thank you for taking the time to answer our questions. The information you
      provided will help us research your claim.
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': conclusionDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};
