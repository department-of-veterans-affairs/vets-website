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

const createRatedDisabilitiesSchema = fullData =>
  ({
    ...createNonSelectedRatedDisabilities(fullData),
    [NEW_CONDITION_OPTION]: NEW_CONDITION_OPTION,
  } || {});

/** @returns {PageSchema} */
const conditionPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Tell us which condition you want to claim',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    ratedDisability: radioUI({
      title:
        'Select which of your service-connected disabilities have gotten worse or select if you are adding a new condition.',
      hint:
        'Choose one, you will return to this screen if you need to add more.',
      updateUiSchema: (_formData, fullData) => ({
        'ui:options': {
          descriptions: createRatedDisabilityDescriptions(fullData),
        },
      }),
      updateSchema: (_formData, _schema, _uiSchema, _index, _path, fullData) =>
        radioSchema(Object.keys(createRatedDisabilitiesSchema(fullData))),
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
