import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
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
  isEdit,
  isNewCondition,
  isRatedDisability,
} from '../shared/utils';

export const NEW_CONDITION_OPTIONS = {
  ADD: 'Add a new condition',
  EDIT: 'Edit new condition',
  CHANGE: 'Change to new condition',
};

const createNewConditionOption = (fullData, index) => {
  let label;

  if (isEdit() && isNewCondition(fullData, index)) {
    label = NEW_CONDITION_OPTIONS.EDIT;
  } else if (isEdit() && isRatedDisability(fullData, index)) {
    label = NEW_CONDITION_OPTIONS.CHANGE;
  } else {
    label = NEW_CONDITION_OPTIONS.ADD;
  }
  return { [label]: label };
};

const createRatedDisabilitiesSchema = (fullData, index) => {
  const nonSelectedRatedDisabilities = createNonSelectedRatedDisabilities(
    fullData,
  );

  return (
    {
      ...nonSelectedRatedDisabilities,
      ...createNewConditionOption(fullData, index),
    } || {}
  );
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
      updateSchema: (_formData, _schema, _uiSchema, index, _path, fullData) => {
        return radioSchema(
          Object.keys(createRatedDisabilitiesSchema(fullData, index)),
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

export const updateFormData = (_oldData, newData) => {
  const index = getArrayIndexFromPathName();
  const { arrayPath } = arrayBuilderOptions;
  const condition = newData[arrayPath]?.[index];
  const isNewConditionOption = Object.values(NEW_CONDITION_OPTIONS).includes(
    condition?.ratedDisability,
  );

  return {
    ...newData,
    [arrayPath]: newData[arrayPath].map((item, i) => {
      if (i === index) {
        return {
          ...item,
          'view:conditionType': isNewConditionOption ? 'NEW' : 'RATED',
        };
      }
      return item;
    }),
  };
};
