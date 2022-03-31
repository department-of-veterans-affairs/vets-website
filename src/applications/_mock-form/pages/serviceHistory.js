// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import toursOfDutyUI from '../definitions/toursOfDuty';

const { toursOfDuty } = commonDefinitions;

const serviceHistory = {
  uiSchema: {
    toursOfDuty: toursOfDutyUI,
  },
  schema: {
    type: 'object',
    properties: {
      toursOfDuty,
    },
  },
};

export default serviceHistory;
