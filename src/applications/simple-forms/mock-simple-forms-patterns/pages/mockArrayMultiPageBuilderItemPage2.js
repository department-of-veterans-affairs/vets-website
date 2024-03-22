import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        formData?.name
          ? `Dates you were employed at ${formData.name}`
          : 'Dates you were employed',
    ),
    dateStart: currentOrPastDateUI('Start date of employment'),
    dateEnd: currentOrPastDateUI('End date of employment'),
  },
  schema: {
    type: 'object',
    properties: {
      dateStart: currentOrPastDateSchema,
      dateEnd: currentOrPastDateSchema,
    },
    required: ['dateStart', 'dateEnd'],
  },
};
