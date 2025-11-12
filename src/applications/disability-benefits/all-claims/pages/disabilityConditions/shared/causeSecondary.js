import {
  arrayBuilderItemSubsequentPageTitleUI,
  selectSchema,
  selectUI,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { conditionOptions } from '../../../content/conditionOptions';
import {
  arrayOptions,
  createNewConditionName,
  isPlaceholderRated,
} from './utils';

const getOtherConditions = (fullData, currentIndex) => {
  const ratedDisabilities =
    fullData?.ratedDisabilities?.map(d => d?.name).filter(Boolean) ?? [];

  const otherNewConditions =
    fullData?.[arrayOptions.arrayPath]?.reduce((acc, item, idx) => {
      if (idx === currentIndex) return acc;
      if (!item?.condition) return acc;
      if (isPlaceholderRated(item.condition)) return acc;
      acc.push(createNewConditionName(item, true));
      return acc;
    }, []) ?? [];

  const combined = [...ratedDisabilities, ...otherNewConditions];
  const seen = new Set();
  return combined.filter(Boolean).filter(label => {
    const key = label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
