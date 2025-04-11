import {
  arrayBuilderItemFirstPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { NEW_CONDITION_OPTION } from '../../constants';
import {
  arrayBuilderOptions,
  createNonSelectedRatedDisabilities,
  createRatedDisabilityDescriptions,
} from '../shared/utils';

const createRatedDisabilitySchema = fullData =>
  ({
    [NEW_CONDITION_OPTION]: NEW_CONDITION_OPTION,
    ...createNonSelectedRatedDisabilities(fullData),
  } || {});

/** @returns {PageSchema} */
const conditionPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Type of condition',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    ratedDisability: radioUI({
      title:
        'Select if you’d like to add a new condition or select which of your service-connected disabilities have gotten worse.',
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
      ratedDisability: radioSchema(['error']),
    },
    required: ['ratedDisability'],
  },
};

export default conditionPage;
