import React from 'react';
import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

import { PtsdNameTitle } from '../content/ptsdClassification';
import { SecondaryDateDescription } from '../content/incidentDate';
import fullSchema from '../config/schema';

const { date } = fullSchema.definitions;

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': formData => (
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
        'view:ptsdDateSecondaryDescription': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
});
