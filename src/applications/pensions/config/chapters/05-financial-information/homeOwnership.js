import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Income and assets',
    homeOwnership: yesNoUI({
      title:
        'Do you, your spouse, or your dependents own your home (also known as your primary residence)?',
      uswds: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      homeOwnership: yesNoSchema,
    },
  },
};
