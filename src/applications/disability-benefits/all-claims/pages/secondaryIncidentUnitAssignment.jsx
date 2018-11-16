import React from 'react';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import {
  ptsdAssignmentDescription,
  ptsdAssignmentDatesDescription,
} from '../content/incidentUnitAssignment';
import { PtsdNameTitle } from '../content/ptsdClassification';

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': ptsdAssignmentDescription,
  [`secondaryIncident${index}`]: {
    [`unitAssignment`]: {
      'ui:title': ' ',
    },
    [`unitAssignmentDates`]: {
      ...dateRangeUI('From', 'To', 'The date must be after Start date'),
      'ui:title': ptsdAssignmentDatesDescription,
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        [`unitAssignment`]: {
          type: 'string',
          maxLength: 100,
        },
        [`unitAssignmentDates`]: {
          type: 'object',
          properties: {
            from: {
              type: 'string',
            },
            to: {
              type: 'string',
            },
          },
        },
      },
    },
  },
});
