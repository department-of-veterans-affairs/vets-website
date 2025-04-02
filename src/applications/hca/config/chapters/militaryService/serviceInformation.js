import MilitaryPrefillMessage from 'platform/forms/save-in-progress/MilitaryPrefillMessage';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  DISCHARGE_TYPE_LABELS,
  SERVICE_BRANCH_LABELS,
} from '../../../utils/constants';
import { validateServiceDates } from '../../../utils/validation';
import { FULL_SCHEMA } from '../../../utils/imports';

const {
  dischargeType,
  lastDischargeDate,
  lastEntryDate,
  lastServiceBranch,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:description': MilitaryPrefillMessage,
    lastServiceBranch: {
      'ui:title': 'Last branch of service',
      'ui:options': {
        labels: SERVICE_BRANCH_LABELS,
      },
    },
    lastEntryDate: currentOrPastDateUI('Service start date'),
    lastDischargeDate: dateUI('Service end date'),
    dischargeType: {
      'ui:title': 'Character of service',
      'ui:options': {
        labels: DISCHARGE_TYPE_LABELS,
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
