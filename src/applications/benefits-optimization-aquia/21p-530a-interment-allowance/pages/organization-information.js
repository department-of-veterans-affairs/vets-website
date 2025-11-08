import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const organizationNamePage = {
  uiSchema: {
    burialInformation: {
      nameOfStateCemeteryOrTribalOrganization: textUI('Organization name'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      burialInformation: {
        type: 'object',
        required: ['nameOfStateCemeteryOrTribalOrganization'],
        properties: { nameOfStateCemeteryOrTribalOrganization: textSchema },
      },
    },
  },
};
