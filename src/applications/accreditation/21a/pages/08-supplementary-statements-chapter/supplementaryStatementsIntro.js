import { descriptionUI } from 'platform/forms-system/src/js/web-component-patterns';

import SupplementaryStatementsIntro from '../../components/08-supplementary-statements-chapter/SupplementaryStatementsIntro';

/** @type {PageSchema} */
export default {
  title: 'Supplementary statements intro',
  path: 'supplementary-statements-intro',
  uiSchema: {
    ...descriptionUI(SupplementaryStatementsIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
