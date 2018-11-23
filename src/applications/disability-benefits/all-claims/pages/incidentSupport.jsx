import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';
import { incidentSupportText } from '../content/incidentSupport';

export const uiSchema = formType => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType={formType} />
  ),
  'ui:description': incidentSupportText,
});

export const schema = {
  type: 'object',
  properties: {},
};
