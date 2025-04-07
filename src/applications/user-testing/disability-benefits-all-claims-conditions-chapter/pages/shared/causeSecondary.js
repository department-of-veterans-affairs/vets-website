import {
  arrayBuilderItemSubsequentPageTitleUI,
  checkboxGroupSchema,
  checkboxGroupUI,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  SecondaryNotListedAlert,
  SecondaryOptionsConflictingAlert,
} from '../../content/conditions';
import { arrayBuilderOptions, createNewConditionName } from './utils';
import { CONDITION_NOT_LISTED_OPTION } from '../../constants';

const getOtherConditionsLabels = (fullData, currentIndex) => {
  const ratedDisabilities =
    fullData?.ratedDisabilities?.reduce((acc, disability) => {
      const disabilityName = disability.name;
      acc[disabilityName] = { 'ui:title': disabilityName };
      return acc;
    }, {}) || {};

  const otherNewConditions = fullData?.[arrayBuilderOptions.arrayPath]?.reduce(
    (acc, condition, index) => {
      if (index !== currentIndex && condition.newCondition) {
        const newConditionName = createNewConditionName(condition, true);
        acc[newConditionName] = { 'ui:title': newConditionName };
      }
      return acc;
    },
    {},
  );

  return {
    ...ratedDisabilities,
    ...otherNewConditions,
    [CONDITION_NOT_LISTED_OPTION]: { 'ui:title': CONDITION_NOT_LISTED_OPTION },
  };
};

const hasConflictingOptions = causedByCondition => {
  if (!causedByCondition) {
    return false;
  }

  const hasConditionNotListedSelected =
    causedByCondition?.[CONDITION_NOT_LISTED_OPTION] === true;

  const hasOtherConditionsSelected = Object.entries(causedByCondition).some(
    ([key, val]) => key !== CONDITION_NOT_LISTED_OPTION && val === true,
  );

  return hasConditionNotListedSelected && hasOtherConditionsSelected;
};

const validateConflictingOptions = (err, fieldData) => {
  if (hasConflictingOptions(fieldData.causedByCondition)) {
    err.addError(' ');
  }
};

/** @returns {PageSchema} */
const causeSecondaryPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Details of the service-connected disability or condition that caused ${createNewConditionName(
          formData,
        )}`,
    ),
    causedByCondition: checkboxGroupUI({
      title:
        'Choose the service-connected disability or condition that caused your new condition.',
      hint: 'Select all that apply.',
      required: true,
      labels: {
        error: 'error',
      },
      updateUiSchema: (_formData, fullData, index) => ({
        'ui:title': `Choose the service-connected disability or condition that caused ${createNewConditionName(
          fullData?.[arrayBuilderOptions.arrayPath]?.[index],
        )}.`,
        ...getOtherConditionsLabels(fullData, index),
      }),
      updateSchema: (_formData, _schema, _uiSchema, index, _path, fullData) =>
        checkboxGroupSchema(
          Object.keys(getOtherConditionsLabels(fullData, index)),
        ),
      errorMessages: {
        required: 'Select at least one condition.',
      },
    }),
    'ui:validations': [validateConflictingOptions],
    'view:notListedAlert': {
      'ui:description': SecondaryNotListedAlert,
      'ui:options': {
        hideIf: (_formData, index, fullData) => {
          const causedByCondition =
            fullData?.[arrayBuilderOptions.arrayPath]?.[index]
              ?.causedByCondition;

          return (
            !causedByCondition?.[CONDITION_NOT_LISTED_OPTION] ||
            hasConflictingOptions(causedByCondition)
          );
        },
      },
    },
    'view:optionsConflictingAlert': {
      'ui:description': SecondaryOptionsConflictingAlert,
      'ui:options': {
        hideIf: (_formData, index, fullData) => {
          const causedByCondition =
            fullData?.[arrayBuilderOptions.arrayPath]?.[index]
              ?.causedByCondition;

          return !hasConflictingOptions(causedByCondition);
        },
      },
    },
    causedByConditionDescription: textareaUI({
      title:
        'Briefly describe how this disability or condition caused your new condition. ',
      updateUiSchema: (_formData, fullData, index) => ({
        'ui:title': `Briefly describe how this disability or condition caused ${createNewConditionName(
          fullData?.[arrayBuilderOptions.arrayPath]?.[index],
        )}.`,
      }),
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      causedByCondition: checkboxGroupSchema(['error']),
      'view:notListedAlert': {
        type: 'object',
        properties: {},
      },
      'view:optionsConflictingAlert': {
        type: 'object',
        properties: {},
      },
      causedByConditionDescription: {
        type: 'string',
        maxLength: 400,
      },
    },
    required: ['causedByCondition', 'causedByConditionDescription'],
  },
};

export default causeSecondaryPage;
