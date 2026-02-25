import {
  titleUI,
  selectUI,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  DISCHARGE_TYPE_LABELS,
  SERVICE_BRANCH_LABELS,
} from '../../../utils/constants';
import { validateServiceDates } from '../../../utils/validation';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const {
  dischargeType,
  lastDischargeDate,
  lastEntryDate,
  lastServiceBranch,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['military-service-info-last-period-title']),
    lastServiceBranch: selectUI({
      title: content['military-service-info-last-period-branch-label'],
      labels: SERVICE_BRANCH_LABELS,
    }),
    lastEntryDate: currentOrPastDateUI(
      content['military-service-info-service-start-date-label'],
    ),
    lastDischargeDate: currentOrPastDateUI(
      content['military-service-info-service-end-date-label'],
    ),
    dischargeType: selectUI({
      title: content['military-service-info-last-period-character-label'],
      labels: DISCHARGE_TYPE_LABELS,
    }),
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
