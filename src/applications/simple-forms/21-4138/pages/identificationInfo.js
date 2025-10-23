import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const identificationInformationPage = {
  uiSchema: {
    ...titleUI({
      title: 'Identification information',
      description:
        'You must enter either a Social Security number or VA File number',
      headerLevel: 1,
    }),
    idNumber: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      idNumber: ssnOrVaFileNumberNoHintSchema,
    },
  },
};
