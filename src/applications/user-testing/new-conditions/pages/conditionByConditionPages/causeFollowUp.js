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

// TODO: [Fix the formData prop on edit so that it contains all form data](https://github.com/department-of-veterans-affairs/vagov-claim-classification/issues/689)
// formData contains all form data on add and only item data on edit which results in the need for the conditional below
const createCauseFollowUpConditional = (formData, index, causeType) => {
  const cause = formData?.[arrayBuilderOptions.arrayPath]
    ? formData?.[arrayBuilderOptions.arrayPath][index]?.cause
    : formData.cause;
  return cause !== causeType;
};

// TODO: [Fix the formData prop on edit so that it contains all form data](https://github.com/department-of-veterans-affairs/vagov-claim-classification/issues/689)
// formData on add contains all form data { "conditionByCondition": [{ "condition": "migraines (headaches)"... }] }
// formData on edit contains only item data { "condition": "migraines (headaches)"... } which does not include ratedDisabilities or other new conditions
// TODO: If causedByCondition is 'asthma' asthma is updated to 'emphysema' ensure 'asthma' is cleared as potential cause
const getOtherConditions = (formData, currentIndex) => {
  const ratedDisabilities =
    formData?.ratedDisabilities?.map(disability => disability.name) || [];

  const otherNewConditions =
    formData?.[arrayBuilderOptions.arrayPath]
      ?.filter((_, index) => index !== currentIndex)
      ?.map(condition => createItemName(condition)) || [];

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
        'Choose the service-connected disability that caused the new condition that you’re claiming here.',
      updateSchema: (formData, _schema, _uiSchema, index) => {
        return selectSchema(getOtherConditions(formData, index));
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
