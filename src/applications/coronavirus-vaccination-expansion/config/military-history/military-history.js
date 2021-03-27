import monthYearRange from 'platform/forms-system/src/js/definitions/monthYearRange';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { dischargeTypeLabels, serviceBranchLabels } from './helper';

export const schema = {
  militaryHistory: {
    type: 'object',
    properties: {
      lastBranchOfService: {
        type: 'string',
        enum: serviceBranchLabels(),
      },
      dateRange: fullSchema.definitions.dateRangeAllRequired,
      characterOfService: {
        type: 'string',
        enum: dischargeTypeLabels(),
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
    dateRange: monthYearRange(),
    characterOfService: {
      'ui:title': 'Character of service',
      'ui:required': () => {
        return true;
      },
    },
  },
};
