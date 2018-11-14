import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';
import {
  incidentLocationSchemas,
  ptsdLocationDescription,
} from '../content/incidentLocation';

const { addressUI, addressSchema } = incidentLocationSchemas();

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': ptsdLocationDescription,
  [`secondaryIncidentLocation${index}`]: addressUI,
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncidentLocation${index}`]: addressSchema,
  },
});
