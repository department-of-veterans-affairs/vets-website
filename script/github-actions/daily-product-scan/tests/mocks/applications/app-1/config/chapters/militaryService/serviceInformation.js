import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import MilitaryPrefillMessage from 'platform/forms/save-in-progress/MilitaryPrefillMessage';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { dischargeTypeLabels, lastServiceBranchLabels } from '../../../helpers';
import { validateServiceDates } from '../../../validation';

const {
  dischargeType,
  lastDischargeDate,
  lastEntryDate,
  lastServiceBranch,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': MilitaryPrefillMessage,
    lastServiceBranch: {
      'ui:title': 'Last branch of service',
      'ui:options': {
        labels: lastServiceBranchLabels,
      },
    },
    // TODO: this should really be a dateRange, but that requires a backend schema change. For now
    // leaving them as dates, but should change these to get the proper dateRange validation
    lastEntryDate: currentOrPastDateUI('Service start date'),
    lastDischargeDate: dateUI('Service end date'),
    dischargeType: {
      'ui:title': 'Character of service',
      'ui:options': {
        labels: dischargeTypeLabels,
      },
    },
    'ui:validations': [validateServiceDates],
  },
  schema: {
    type: 'object',
    properties: {
      lastServiceBranch,
      lastEntryDate,
      lastDischargeDate,
      dischargeType,
    },
    required: [
      'lastServiceBranch',
      'lastEntryDate',
      'lastDischargeDate',
      'dischargeType',
    ],
  },
};
