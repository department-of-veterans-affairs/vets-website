import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const veteranIdentificationInformationPage = {
  uiSchema: {
    ...titleUI({
      title: "Veteran's identification information",
      description:
        'You must enter either a Social Security number or VA File number',
      headerLevel: 1,
    }),
    veteranIdNumber: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranIdNumber: ssnOrVaFileNumberNoHintSchema,
    },
  },
};

