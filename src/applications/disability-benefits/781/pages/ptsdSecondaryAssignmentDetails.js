import React from 'react';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import { PtsdNameTitle } from '../helpers';

const ptsdAssignmentDescription = () => (
  <div>
    <h5>Your assignment</h5>
    <p>
      What unit were you assigned to when this event happened? This can include
      your division, wing, battalion, cavalry, ship, etc.
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': ptsdAssignmentDescription,
  secondaryUnitAssigned: {
    'ui:title': ' ',
  },
  secondaryUnitAssignedDates: dateRangeUI(
    'Date unit assignment started',
    'Date unit assignment ended',
    'The date must be after Start date',
  ),
};

export const schema = {
  type: 'object',
  properties: {
    secondaryUnitAssigned: {
      type: 'string',
      maxLength: 100,
    },
    secondaryUnitAssignedDates: {
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
};
