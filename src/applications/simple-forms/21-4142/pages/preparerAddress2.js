import {
  titleUI,
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { preparerIdentificationFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [preparerIdentificationFields.parentObject]: {
      ...titleUI('Mailing address'),
      [preparerIdentificationFields.preparerAddress]: addressNoMilitaryUI({
        omit: ['street3'],
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [preparerIdentificationFields.parentObject]: {
        type: 'object',
        properties: {
          [preparerIdentificationFields.preparerAddress]: addressNoMilitarySchema(
            {
              omit: ['street3'],
            },
          ),
        },
      },
    },
  },
};
