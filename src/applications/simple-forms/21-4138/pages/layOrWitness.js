import { largeTitleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import { LAY_OR_WITNESS_HANDOFF } from '../config/constants';

/** @type {PageSchema} */
export const layOrWitnessHandoffPage = {
  uiSchema: {
    ...largeTitleUI("There's a better way to submit your statement to us"),
    'view:layOrWitnessContent': {
      'ui:description': LAY_OR_WITNESS_HANDOFF,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:layOrWitnessContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};
