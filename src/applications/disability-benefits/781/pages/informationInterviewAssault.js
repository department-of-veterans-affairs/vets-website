import React from 'react';
import { IncidentIntroduction } from '../helpers';

export const uiSchema = {
  'ui:description': ({ formData }) => (
    <IncidentIntroduction formData={formData} formType="781a" />
  ),
};

export const schema = {
  type: 'object',
  properties: {},
};
