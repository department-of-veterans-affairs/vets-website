import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
// eslint-disable-next-line import/no-unresolved
import { ViewPersonalInformation } from '../components/ViewPersonalInformation';
import { MedallionsDescription } from '../components/MedallionsDescription';

const blankSchema = { type: 'object', properties: {} };

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Confirm the personal information we have on file for you'),
    'ui:description': formContext => MedallionsDescription(formContext),
    personalInformation: {
      'ui:field': () => ViewPersonalInformation(),
      'ui:options': {
        keepInPageOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      personalInformation: blankSchema,
    },
  },
};
