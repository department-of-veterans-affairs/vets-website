import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  largeTitleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const identificationInformationPage = {
  uiSchema: {
    ...largeTitleUI(
      'Identification information',
      'You must enter either a Social Security number or VA File number',
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
