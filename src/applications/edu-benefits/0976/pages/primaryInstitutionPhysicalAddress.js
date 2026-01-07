// @ts-check
import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    primaryInstitutionDetails: {
      ...titleUI("Enter institution's physical address"),
      physicalAddress: {
        ...addressNoMilitaryUI(),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      primaryInstitutionDetails: {
        type: 'object',
        properties: {
          physicalAddress: addressNoMilitarySchema(),
        },
        required: ['physicalAddress'],
      },
    },
  },
};
