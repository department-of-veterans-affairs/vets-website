import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import SupplementaryInformationIntro from '../../components/08-supplementary-statements-chapter/SupplementaryInformationIntro';

/** @type {PageSchema} */
export default {
  title: 'Supplementary statements intro',
  path: 'supplementary-statements-intro',
  uiSchema: {
    ...titleUI('Optional supplemental and personal statements'),
    ...descriptionUI(SupplementaryInformationIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
