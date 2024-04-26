import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const identificationInformationPage = {
  uiSchema: {
    ...titleUI(
      'Identification information',
      'You must enter either a Social Security number or VA File number',
      1,
      'vads-u-color--black',
    ),
    idNumber: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      idNumber: ssnOrVaFileNumberNoHintSchema,
    },
  },
};
