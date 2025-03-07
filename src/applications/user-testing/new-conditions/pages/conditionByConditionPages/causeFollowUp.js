import {
  arrayBuilderItemSubsequentPageTitleUI,
  selectSchema,
  selectUI,
  textareaUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { conditionOptions } from '../../content/conditionOptions';
import { arrayBuilderOptions, createItemName } from './utils';

export const createCauseFollowUpTitles = formData => {
  const causeTitle = {
    NEW: `Details of injury or exposure that caused ${createItemName(
      formData,
    )}`,
    SECONDARY: `Details of the service-connected disability that caused ${createItemName(
      formData,
    )}`,
    WORSENED: `Details of the injury or exposure that worsened ${createItemName(
      formData,
    )}`,
    VA: `Details of the injury or event in VA care for ${createItemName(
      formData,
    )}`,
  };

  return causeTitle[formData.cause];
};

// TODO: [Apply fix for index is null in hideIf and required for multi-page list and loop edit in new-conditions application](https://github.com/department-of-veterans-affairs/vagov-claim-classification/issues/721)
// Remove this conditional once the fix is applied
const createCauseFollowUpConditional = (formData, index, causeType) => {
  const cause = formData?.[arrayBuilderOptions.arrayPath]
    ? formData?.[arrayBuilderOptions.arrayPath][index]?.cause
    : formData.cause;
  return cause !== causeType;
};

const getOtherConditions = (currentIndex, fullData) => {
  const ratedDisabilities =
    fullData?.ratedDisabilities?.map(disability => disability.name) || [];

  const otherNewConditions =
    fullData?.[arrayBuilderOptions.arrayPath]?.reduce(
      (others, condition, index) => {
        if (index !== currentIndex) {
          others.push(createItemName(condition));
        }
        return others;
      },
      [],
    ) || [];

  return [...ratedDisabilities, ...otherNewConditions];
};

/** @returns {PageSchema} */
const causeFollowUpPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
      createCauseFollowUpTitles(formData),
    ),
    primaryDescription: textareaUI({
      title:
        'Briefly describe the injury or exposure that caused your condition. For example, I operated loud machinery while in the service, and this caused me to lose my hearing.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'NEW'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'NEW'),
      charcount: true,
    }),
    causedByCondition: selectUI({
      title:
        "Choose the service-connected disability that caused the new condition that you're claiming here.",
      updateSchema: (_formData, _schema, _uiSchema, index, _path, fullData) => {
        return selectSchema(getOtherConditions(index, fullData));
      },
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'SECONDARY'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'SECONDARY'),
    }),
    causedByConditionDescription: textareaUI({
      title: 'Briefly describe how this disability caused your new condition.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'SECONDARY'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'SECONDARY'),
      charcount: true,
    }),
    worsenedDescription: textUI({
      title:
        'Briefly describe the injury or exposure during your military service that caused your existing disability to get worse.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'WORSENED'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'WORSENED'),
      charcount: true,
    }),
    worsenedEffects: textareaUI({
      title:
        'Tell us how the disability affected you before your service, and how it affects you now after your service.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'WORSENED'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'WORSENED'),
      charcount: true,
    }),
    vaMistreatmentDescription: textareaUI({
      title:
        'Briefly describe the injury or event while you were under VA care that caused your disability.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'VA'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'VA'),
      charcount: true,
    }),
    vaMistreatmentLocation: textUI({
      title: 'Tell us where this happened.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'VA'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'VA'),
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      primaryDescription: {
        type: 'string',
        maxLength: 400,
      },
      causedByCondition: selectSchema(conditionOptions),
      causedByConditionDescription: {
        type: 'string',
        maxLength: 400,
      },
      worsenedDescription: {
        type: 'string',
        maxLength: 50,
      },
      worsenedEffects: {
        type: 'string',
        maxLength: 350,
      },
      vaMistreatmentDescription: {
        type: 'string',
        maxLength: 350,
      },
      vaMistreatmentLocation: {
        type: 'string',
        maxLength: 25,
      },
    },
  },
};

export default causeFollowUpPage;
