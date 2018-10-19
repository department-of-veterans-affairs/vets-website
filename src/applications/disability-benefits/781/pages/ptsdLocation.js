import React from 'react';
import { PtsdNameTitle, locationSchemas } from '../helpers';

const ptsdLocationDescription = () => (
  <div>
    <h5>Event location</h5>
    <p>Where did the event happen? Please be as specific as you can.</p>
  </div>
);

const { addressUI, addressSchema } = locationSchemas();

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781" />
  ),
  'ui:description': ptsdLocationDescription,
  incidentLocation: addressUI,
};

export const schema = {
  type: 'object',
  properties: {
    incidentLocation: addressSchema,
  },
};
