import {
  arrayBuilderItemSubsequentPageTitleUI,
  selectSchema,
  selectUI,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { conditionOptions } from '../../../content/conditionOptions';
import { arrayOptions, createNewConditionName } from './utils';

const getOtherConditions = (fullData, currentIndex) => {
  const ratedDisabilities =
    fullData?.ratedDisabilities?.map(disability => disability.name) || [];

  const otherNewConditions = fullData?.[arrayOptions.arrayPath].reduce(
    (acc, condition, index) => {
      if (condition.condition && index !== currentIndex) {
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
      ({ formData }) => createNewConditionName(formData, true),
      undefined,
      false,
    ),
    causedByDisability: selectUI({
      title:
        'Choose the service-connected disability that caused your new condition.',
      updateUiSchema: (_formData, fullData, index) => ({
        'ui:title': `Choose the service-connected disability or condition that caused ${createNewConditionName(
          fullData?.[arrayOptions.arrayPath]?.[index],
        )}.`,
      }),
      updateSchema: (_formData, _schema, _uiSchema, index, _path, fullData) =>
        selectSchema(getOtherConditions(fullData, index)),
    }),
    causedByDisabilityDescription: textareaUI({
      title: 'Briefly describe how this disability led to your new condition. ',
      updateUiSchema: (_formData, fullData, index) => ({
        'ui:title': `Briefly describe how this disability or condition caused ${createNewConditionName(
          fullData?.[arrayOptions.arrayPath]?.[index],
        )}.`,
      }),
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      causedByDisability: selectSchema(conditionOptions),
      causedByDisabilityDescription: {
        type: 'string',
        maxLength: 400,
      },
    },
    required: ['causedByDisability', 'causedByDisabilityDescription'],
  },
};

export default causeSecondaryPage;
