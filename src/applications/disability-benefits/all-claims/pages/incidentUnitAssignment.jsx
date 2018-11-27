import React from 'react';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import {
  ptsdAssignmentDescription,
  ptsdAssignmentDatesDescription,
} from '../content/incidentUnitAssignment';
import { PtsdNameTitle } from '../content/ptsdClassification';

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781" />
  ),
  'ui:description': ptsdAssignmentDescription,
  [`incident${index}`]: {
    [`unitAssigned`]: {
      'ui:title': ' ',
    },
    [`unitAssignedDates`]: {
      ...dateRangeUI('From', 'To', 'The date must be after Start date'),
      'ui:title': ptsdAssignmentDatesDescription,
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`incident${index}`]: {
      type: 'object',
      properties: {
        [`unitAssigned`]: {
          type: 'string',
          maxLength: 100,
        },
        [`unitAssignedDates`]: {
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
