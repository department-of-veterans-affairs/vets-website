// @ts-check
import {
  titleUI,
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Identification information',
      'You must enter a Social Security number or VA file number',
    ),
    claimantPersonalInformation: {
      veteranId: ssnOrVaFileNumberNoHintUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      claimantPersonalInformation: {
        type: 'object',
        properties: {
          veteranId: ssnOrVaFileNumberNoHintSchema,
        },
        required: ['veteranId'],
      },
    },
  },
};
