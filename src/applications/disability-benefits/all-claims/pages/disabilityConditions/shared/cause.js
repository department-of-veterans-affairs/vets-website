import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { createNewConditionName } from './utils';

export const causeOptions = {
  NEW:
    'An injury, exposure, event, or onset of disease during my military service',
  SECONDARY: 'A service-connected disability I already have',
  WORSENED:
    'An existing condition I had before my service that worsened because of my service',
  VA: 'An injury, exposure, or event due to care I received from VA',
};

const countSecondaryParents = (fullData, currentIndex) => {
  const ratedCount = Array.isArray(fullData?.ratedDisabilities)
    ? fullData.ratedDisabilities.filter(d => d?.name).length
    : 0;

  const newItems = Array.isArray(fullData?.newDisabilities)
    ? fullData.newDisabilities
    : [];

  const otherNewCount = newItems.reduce((count, item, idx) => {
    if (idx === currentIndex) return count;

    const hasName = item?.condition || item?.newCondition || item?.name;

    return hasName ? count + 1 : count;
  }, 0);

  return ratedCount + otherNewCount;
};

const allowSecondary = (formData, index) => {
  if (typeof index === 'number') {
    return countSecondaryParents(formData, index) > 0;
  }

  const ratedCount = Array.isArray(formData?.ratedDisabilities)
    ? formData.ratedDisabilities.filter(d => d?.name).length
    : 0;

  const newCount = Array.isArray(formData?.newDisabilities)
    ? formData.newDisabilities.filter(
        it => it?.condition || it?.newCondition || it?.name,
      ).length
    : 0;

  const possibleParents = ratedCount + Math.max(newCount - 1, 0);
  return possibleParents > 0;
};

const allowedCauseValues = (formData, index) => {
  const base = Object.keys(causeOptions);
  return allowSecondary(formData, index)
    ? base
    : base.filter(v => v !== 'SECONDARY');
};

const baseRadioUI = radioUI({
  title: 'What caused your condition?',
  labels: causeOptions,
});

const causePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => createNewConditionName(formData, true),
      undefined,
      false,
    ),

    cause: {
      ...baseRadioUI,
      'ui:options': {
        ...baseRadioUI['ui:options'],
        updateSchema: (...args) => {
          // eslint-disable-next-line no-unused-vars
          const [_itemData, schema, _uiSchema, index, _path, fullData] = args;
          return {
            ...schema,
            enum: allowedCauseValues(fullData || _itemData, index),
          };
        },
      },
      'ui:required': formData => !formData?.ratedDisability,
    },
  },

  schema: {
    type: 'object',
    properties: {
      cause: radioSchema(Object.keys(causeOptions)),
    },
  },
};

export default causePage;
