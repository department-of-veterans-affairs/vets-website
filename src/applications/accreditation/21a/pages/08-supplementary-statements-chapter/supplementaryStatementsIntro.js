import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import SupplementaryStatementsIntro from '../../components/08-supplementary-statements-chapter/SupplementaryStatementsIntro';

/** @type {PageSchema} */
export default {
  title: 'Supplementary statements intro',
  path: 'supplementary-statements-intro',
  uiSchema: {
    ...titleUI(
      'Optional supplemental and personal statements',
      SupplementaryStatementsIntro,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
