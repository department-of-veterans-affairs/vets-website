import React from 'react';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { PtsdDateDescription } from '../content/incidentDate';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { PTSD_TYPES_TO_FORMS } from '../constants';

const {
  incidentDate,
} = fullSchema.definitions.secondaryPtsdIncident.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': (
    <PtsdDateDescription
      formType={PTSD_TYPES_TO_FORMS.personalAssaultSexualTrauma}
    />
  ),
  [`secondaryIncident${index}`]: {
    incidentDate: currentOrPastDateUI('Date of event'),
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: { incidentDate },
    },
  },
});
