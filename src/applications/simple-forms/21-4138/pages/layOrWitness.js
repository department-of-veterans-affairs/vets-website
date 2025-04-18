import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import { LAY_OR_WITNESS_HANDOFF } from '../config/constants';

/** @type {PageSchema} */
export const layWitnessStatementPage = {
  uiSchema: {
    ...titleUI("There's a better way to submit your statement"),
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
