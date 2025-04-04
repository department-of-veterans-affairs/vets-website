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
        `Details of the service-connected disability or condition that caused ${createNewConditionName(
          formData,
        )}`,
    ),
    causedByCondition: selectUI({
      title:
        'Choose the service-connected disability or condition that caused your new condition.',
      updateSchema: (_formData, _schema, _uiSchema, index, _path, fullData) =>
        selectSchema(getOtherConditions(fullData, index)),
    }),
    causedByConditionDescription: textareaUI({
      title:
        'Briefly describe how this disability or condition caused your new condition. ',
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
