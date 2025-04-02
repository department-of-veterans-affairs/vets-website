import {
  arrayBuilderItemFirstPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderOptions } from '../shared/utils';

const conditionTypeOptions = {
  RATED:
    'A service-connected disability I have already received a rating for, but has gotten worse since the rating  decision.',
  NEW: 'A condition I have not applied for before.',
};

/** @returns {PageSchema} */
const conditionTypePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Type of condition you are applying for',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    'view:conditionType': radioUI({
      title: 'What type of condition are you applying for?',
      hint:
        'Choose one, you will return to this screen if you need to add more.',
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
