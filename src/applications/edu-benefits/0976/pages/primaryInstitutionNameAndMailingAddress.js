// @ts-check
import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  checkboxUI,
  checkboxSchema,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

/** @type {PageSchema} */
export default {
  uiSchema: {
    primaryInstitutionDetails: {
      ...titleUI('Enter institution name and mailing address'),
      name: {
        ...textUI({
          title: 'Institution name',
          errorMessages: {
            required: 'Enter the institution name',
          },
          validations: [validateWhiteSpace],
        }),
      },
      differentPhysicalAddress: {
        ...checkboxUI({
          title:
            'Institution’s physical address is different than the mailing address',
        }),
      },
      mailingAddress: {
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
          name: textSchema,
          differentPhysicalAddress: checkboxSchema,
          mailingAddress: addressNoMilitarySchema(),
        },
        required: ['name', 'mailingAddress'],
      },
    },
  },
};
