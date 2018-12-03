import React from 'react';
import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { SecondaryDateDescription } from '../content/incidentDate';
import fullSchema from '../config/schema';

const { date } = fullSchema.definitions;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': ({ formData }) => (
    <SecondaryDateDescription formData={formData} index={index} />
  ),
  [`secondaryIncident${index}`]: {
    incidentDate: currentOrPastDateUI(' '),
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        incidentDate: date,
      },
    },
  },
});
