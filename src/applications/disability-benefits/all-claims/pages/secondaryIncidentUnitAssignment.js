import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import {
  ptsdAssignmentDescription,
  ptsdAssignmentDatesTitle,
  ptsdAssignmentDatesDescription,
} from '../content/incidentUnitAssignment';
import { ptsd781aNameTitle } from '../content/ptsdClassification';

const {
  unitAssigned,
  unitAssignedDates,
} = fullSchema.definitions.secondaryPtsdIncident.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': ptsdAssignmentDescription,
  [`secondaryIncident${index}`]: {
    unitAssigned: {
      'ui:title':
        'Name of the unit you were assigned to when this event happened. (This can include your division, wing, battalion, cavalry, ship, etc.)',
    },
    unitAssignedDates: {
      ...dateRangeUI('From', 'To', 'The date must be after Start date'),
      'ui:title': ptsdAssignmentDatesTitle,
      'ui:description': ptsdAssignmentDatesDescription,
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        unitAssigned,
        unitAssignedDates,
      },
    },
  },
});
