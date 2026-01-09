import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
  currentOrPastDateDigitsUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { servicesOptions } from '../../../utils/labels';

/** @type {PageSchema} */
export default {
  title: 'Service period',
  path: 'veteran/service-period',
  uiSchema: {
    ...titleUI('Service period'),
    serviceBranch: checkboxGroupUI({
      title: 'Branch of service',
      required: true,
      labels: servicesOptions,
    }),
    dateInitiallyEnteredActiveDuty: currentOrPastDateDigitsUI({
      title: 'Date initially entered active duty',
    }),
    finalReleaseDateFromActiveDuty: currentOrPastDateUI({
      title: 'Final release date from active duty',
      monthSelect: false,
    }),
    placeOfSeparation: textUI({
      title: 'Place of Veteran’s last separation',
      hint: 'City, state, or foreign country',
    }),
  },
  schema: {
    type: 'object',
    required: [
      'serviceBranch',
      'dateInitiallyEnteredActiveDuty',
      'finalReleaseDateFromActiveDuty',
      'placeOfSeparation',
    ],
    properties: {
      serviceBranch: checkboxGroupSchema(Object.keys(servicesOptions)),
      dateInitiallyEnteredActiveDuty: currentOrPastDateSchema,
      finalReleaseDateFromActiveDuty: currentOrPastDateSchema,
      placeOfSeparation: textSchema,
    },
  },
};
