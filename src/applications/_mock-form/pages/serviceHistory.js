// In a real app this would not be imported directly; instead the schema that
// is imported from vets-json-schema should include these common definitions:
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
