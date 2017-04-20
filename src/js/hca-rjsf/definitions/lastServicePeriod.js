import _ from 'lodash/fp';
import * as dateRange from '../../common/schemaform/definitions/dateRange';

export const schema = {
  type: 'object',
  properties: {
    lastServiceBranch: {
      type: 'string'
    },
    serviceDates: _.assign(dateRange.schema, {
      required: ['lastEntryDate', 'lastDischargeDate']
    }),
    dischargeType: {
      type: 'string'
    },
  },
  required: ['lastServiceBranch', 'serviceDates', 'dischargeType']
};

export const uiSchema = {
};
