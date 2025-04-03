import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  createNonSelectedRatedDisabilities,
  createRatedDisabilityDescriptions,
} from '../shared/utils';

const createRatedDisabilitySchema = fullData =>
  createNonSelectedRatedDisabilities(fullData) || {};

/** @returns {PageSchema} */
const ratedDisabilityPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Tell us which service-connected disability has worsened',
    ),
    ratedDisability: radioUI({
      title:
        'Select which of your service-connected disabilities has worsened.',
      hint:
        'Choose one, you will return to this screen if you need to add more.',
      updateUiSchema: (_formData, fullData) => ({
        'ui:options': {
          descriptions: createRatedDisabilityDescriptions(fullData),
        },
      }),
      updateSchema: (_formData, _schema, _uiSchema, _index, _path, fullData) =>
        radioSchema(Object.keys(createRatedDisabilitySchema(fullData))),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      ratedDisability: radioSchema(
        Object.keys({
          Error: 'Error',
        }),
      ),
    },
    required: ['ratedDisability'],
  },
};

export default ratedDisabilityPage;
