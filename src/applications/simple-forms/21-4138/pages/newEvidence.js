import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import { NEW_EVIDENCE_HANDOFF } from '../config/constants';

/** @type {PageSchema} */
export const claimStatusToolPage = {
  uiSchema: {
    ...titleUI({
      title: "There's a better way to request your personal records",
      headerLevel: 1,
    }),
    'view:newEvidenceHandoffContent': {
      'ui:description': NEW_EVIDENCE_HANDOFF,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:newEvidenceHandoffContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};
