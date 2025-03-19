import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { ViewPersonalInformation } from '../components/ViewPersonalInformation';

const blankSchema = { type: 'object', properties: {} };

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Confirm the personal information we have on file for you'),
    personalInformation: {
      'ui:field': () => ViewPersonalInformation(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      personalInformation: blankSchema,
    },
  },
};
