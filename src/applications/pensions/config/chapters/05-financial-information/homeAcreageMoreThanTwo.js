import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Income and assets',
    homeAcreageMoreThanTwo: yesNoUI({
      title:
        'Is your home located on a lot of land that’s more than 2 acres (or 87,120 square feet)?',
      uswds: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      homeAcreageMoreThanTwo: yesNoSchema,
    },
  },
};
