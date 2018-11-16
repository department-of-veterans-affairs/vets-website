import React from 'react';

import { incidentInformation } from '../content/incidentInfo';
import { PtsdNameTitle } from '../content/ptsdClassification';

export const uiSchema = formType => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType={formType} />
  ),
  'ui:description': incidentInformation,
});

export const schema = {
  type: 'object',
  properties: {},
};
