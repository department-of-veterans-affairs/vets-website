import React from 'react';
import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

import { PtsdNameTitle } from '../content/ptsdClassification';
import { SecondaryDateDescription } from '../content/incidentDate';
import fullSchema from '../config/schema';

const { date } = fullSchema.definitions;

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781" />
  ),
  'ui:description': formData => (
    <SecondaryDateDescription formData={formData} index={index} />
  ),
  [`secondaryIncidentDate${index}`]: currentOrPastDateUI(' '),
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncidentDate${index}`]: date,
    'view:ptsdDateSecondaryDescription': {
      type: 'object',
      properties: {},
    },
  },
});
