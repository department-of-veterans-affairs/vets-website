import {
  titleUI,
  selectUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
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
    ...titleUI(content['service-info--last-period-title']),
    lastServiceBranch: selectUI({
      'ui:title': content['service-info--last-period-branch-label'],
      'ui:options': {
        labels: SERVICE_BRANCH_LABELS,
      },
      required: () => true,
    }),
    lastEntryDate: currentOrPastDateUI(
      content['service-info--service-start-date-label'],
    ),
    lastDischargeDate: dateUI(content['service-info--service-end-date-label']),
    dischargeType: {
      'ui:title': content['service-info--last-period-character-label'],
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
