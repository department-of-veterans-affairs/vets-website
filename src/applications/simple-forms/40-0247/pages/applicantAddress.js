import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    applicantAddress: addressNoMilitaryUI(),
  },
  schema: {
    type: 'object',
    properties: {
      applicantAddress: addressNoMilitarySchema(),
    },
    required: ['applicantAddress'],
  },
};
