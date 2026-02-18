// no React import needed (no JSX in this module)
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Homeownership'),
  homeOwnership: yesNoUI({
    title:
      'Do you or your dependents own your home (also known as your primary residence)?',
    'ui:required': true,
  }),
};

const schema = {
  type: 'object',
  required: ['homeOwnership'],
  properties: {
    homeOwnership: yesNoSchema,
  },
};

export default {
  uiSchema,
  schema,
};
