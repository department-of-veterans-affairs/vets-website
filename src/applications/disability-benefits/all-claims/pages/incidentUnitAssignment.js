import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import {
  ptsdAssignmentDescription,
  ptsdAssignmentDatesTitle,
  ptsdAssignmentDatesDescription,
} from '../content/incidentUnitAssignment';
import { ptsd781NameTitle } from '../content/ptsdClassification';

const {
  unitAssigned,
  unitAssignedDates,
} = fullSchema.definitions.ptsdIncident.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': ptsdAssignmentDescription,
  [`incident${index}`]: {
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
    [`incident${index}`]: {
      type: 'object',
      properties: {
        unitAssigned,
        unitAssignedDates,
      },
    },
  },
});
