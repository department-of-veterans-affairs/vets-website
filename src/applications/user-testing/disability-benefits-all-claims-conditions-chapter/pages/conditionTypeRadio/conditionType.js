import {
  radioSchema,
  radioUI,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderOptions } from '../shared/utils';

const conditionTypeOptions = {
  RATED: 'Already rated, it has worsened',
  NEW: 'A condition I haven’t applied for',
};

/** @returns {PageSchema} */
const conditionTypePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Type of condition you are applying for',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    'view:conditionType': radioUI({
      title: 'Select condition type',
      labels: conditionTypeOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:conditionType': radioSchema(Object.keys(conditionTypeOptions)),
    },
  },
};

export default conditionTypePage;
