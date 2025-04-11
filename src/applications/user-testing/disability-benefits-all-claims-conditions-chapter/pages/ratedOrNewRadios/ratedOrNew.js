import {
  radioSchema,
  radioUI,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderOptions } from '../shared/utils';

const ratedOrNewOptions = {
  RATED: 'Already rated, it has worsened',
  NEW: 'A condition I haven’t applied for',
};

/** @returns {PageSchema} */
const sideOfBodyPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Type of condition you are applying for',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    ratedOrNew: radioUI({
      title: 'Select rated disability or new condition',
      labels: ratedOrNewOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      ratedOrNew: radioSchema(Object.keys(ratedOrNewOptions)),
    },
  },
};

export default sideOfBodyPage;
