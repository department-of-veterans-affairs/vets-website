import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
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

const createNewConditionOption = () => {
  const search = getArrayUrlSearchParams();
  const isEdit = search.get('edit');

  if (isEdit) {
    return {
      'Edit new condition': 'Edit new condition',
    };
  }

  return {
    'Add a new condition': 'Add a new condition',
  };
};

const createRatedDisabilitiesSchema = fullData => {
  const nonSelectedRatedDisabilities = createNonSelectedRatedDisabilities(
    fullData,
  );

  return {
    ...nonSelectedRatedDisabilities,
    ...createNewConditionOption(),
  };
};

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
          'Tell us which condition you want to claim',
          `Edit condition`,
        ),
      withAlertOrDescription({
        nounSingular: arrayBuilderOptions.nounSingular,
        hasMultipleItemPages: true,
      }),
    ),
    ratedDisability: radioUI({
      title:
        'Select a rated disability that worsened or a new condition to claim',
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
