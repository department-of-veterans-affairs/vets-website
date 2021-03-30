import monthYearRange from 'platform/forms-system/src/js/definitions/monthYearRange';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import {
  branchesServed,
  dischargeTypes,
} from 'platform/static-data/options-for-select';

export const schema = {
  militaryHistory: {
    type: 'object',
    properties: {
      lastBranchOfService: {
        type: 'string',
        enum: branchesServed.map(branch => branch.label),
      },
      dateRange: fullSchema.definitions.dateRangeAllRequired,
      characterOfService: {
        type: 'string',
        enum: dischargeTypes.map(type => type.label),
      },
    },
  },
};

export const uiSchema = {
  militaryHistory: {
    lastBranchOfService: {
      'ui:title': 'Last branch of service',
      'ui:required': () => {
        return true;
      },
    },
    dateRange: monthYearRange('Service start date', 'Service end date'),
    characterOfService: {
      'ui:title': 'Character of service',
      'ui:required': () => {
        return true;
      },
    },
  },
};
