import {
  radioSchema,
  radioUI,
  titleUI,
  withAlertOrDescription,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  arrayBuilderOptions,
  createDefaultAndEditTitles,
  createNonSelectedRatedDisabilities,
} from '../shared/utils';

const createRatedDisabilitiesSchema = fullData =>
  createNonSelectedRatedDisabilities(fullData) || {};

const createRatedDisabilitiesDescriptions = fullData => {
  return fullData.ratedDisabilities.reduce((acc, disability) => {
    let text = `Current rating: ${disability.ratingPercentage}%`;

    if (disability.ratingPercentage === disability.maximumRatingPercentage) {
      text += ` (You’re already at the maximum for this rated disability.)`;
    }

    acc[disability.name] = text;

    return acc;
  }, {});
};

/** @returns {PageSchema} */
const conditionPage = {
  uiSchema: {
    ...titleUI(
      () =>
        createDefaultAndEditTitles(
          'Tell us which conditions you want to claim',
          `Edit rated disability that worsened`,
        ),
      withAlertOrDescription({
        nounSingular: arrayBuilderOptions.nounSingular,
      }),
    ),
    ratedDisability: radioUI({
      title: 'Select which existing disability has worsened.',
      hint: 'Select one, you will have the opportunity to add more later.',
      updateUiSchema: (_formData, fullData) => {
        return {
          'ui:options': {
            descriptions: createRatedDisabilitiesDescriptions(fullData),
          },
        };
      },
      updateSchema: (
        _formData,
        _schema,
        _uiSchema,
        _index,
        _path,
        fullData,
      ) => {
        return radioSchema(
          Object.keys(createRatedDisabilitiesSchema(fullData)),
        );
      },
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

export default conditionPage;
