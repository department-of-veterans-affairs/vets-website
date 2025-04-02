import {
  arrayBuilderItemSubsequentPageTitleUI,
  selectSchema,
  selectUI,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { conditionOptions } from '../../content/conditionOptions';
import { arrayBuilderOptions, createNewConditionName } from './utils';

const getOtherConditions = (fullData, currentIndex) => {
  const ratedDisabilities =
    fullData?.ratedDisabilities?.map(disability => disability.name) || [];

  const otherNewConditions = fullData?.[arrayBuilderOptions.arrayPath].reduce(
    (acc, condition, index) => {
      if (condition.newCondition && index !== currentIndex) {
        acc.push(createNewConditionName(condition, true));
      }
      return acc;
    },
    [],
  );

  return [...ratedDisabilities, ...otherNewConditions];
};

/** @returns {PageSchema} */
const causeSecondaryPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Provide details of the service-connected disability or condition that caused ${createNewConditionName(
          formData,
        )}`,
    ),
    causedByCondition: selectUI({
      title:
        'Choose the service-connected disability or condition that caused your new condition.',
      updateUiSchema: (_formData, fullData, index) => ({
        'ui:title': `Choose the service-connected disability or condition that caused ${createNewConditionName(
          fullData?.[arrayBuilderOptions.arrayPath]?.[index],
        )}.`,
      }),
      updateSchema: (_formData, _schema, _uiSchema, index, _path, fullData) =>
        selectSchema(getOtherConditions(fullData, index)),
    }),
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
      causedByCondition: selectSchema(conditionOptions),
      causedByConditionDescription: {
        type: 'string',
        maxLength: 400,
      },
    },
    required: ['causedByCondition', 'causedByConditionDescription'],
  },
};

export default causeSecondaryPage;
