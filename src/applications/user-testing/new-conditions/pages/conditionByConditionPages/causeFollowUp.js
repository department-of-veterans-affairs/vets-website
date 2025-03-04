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
const createCauseFollowUpConditional = (index, fullData, causeType) => {
  const cause = fullData?.[arrayBuilderOptions.arrayPath][index]?.cause;
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
      hideIf: (_formData, index, fullData) => {
        // console.log('hideIf fullData', fullData);
        // console.log('hideIf index', index);
        return createCauseFollowUpConditional(index, fullData, 'NEW');
      },
      required: (_formData, index, fullData) => {
        // console.log('required fullData', fullData);
        // console.log('required index', index);
        return !createCauseFollowUpConditional(index, fullData, 'NEW');
      },
      charcount: true,
    }),
    causedByCondition: selectUI({
      title:
        "Choose the service-connected disability that caused the new condition that you're claiming here.",
      updateSchema: (_formData, _schema, _uiSchema, index, _path, fullData) => {
        return selectSchema(getOtherConditions(index, fullData));
      },
      hideIf: (_formData, index, fullData) =>
        createCauseFollowUpConditional(index, fullData, 'SECONDARY'),
      required: (_formData, index, fullData) =>
        !createCauseFollowUpConditional(index, fullData, 'SECONDARY'),
    }),
    causedByConditionDescription: textareaUI({
      title: 'Briefly describe how this disability caused your new condition.',
      hideIf: (_formData, index, fullData) =>
        createCauseFollowUpConditional(index, fullData, 'SECONDARY'),
      required: (_formData, index, fullData) =>
        !createCauseFollowUpConditional(index, fullData, 'SECONDARY'),
      charcount: true,
    }),
    worsenedDescription: textUI({
      title:
        'Briefly describe the injury or exposure during your military service that caused your existing disability to get worse.',
      hideIf: (_formData, index, fullData) =>
        createCauseFollowUpConditional(index, fullData, 'WORSENED'),
      required: (_formData, index, fullData) =>
        !createCauseFollowUpConditional(index, fullData, 'WORSENED'),
      charcount: true,
    }),
    worsenedEffects: textareaUI({
      title:
        'Tell us how the disability affected you before your service, and how it affects you now after your service.',
      hideIf: (_formData, index, fullData) =>
        createCauseFollowUpConditional(index, fullData, 'WORSENED'),
      required: (_formData, index, fullData) =>
        !createCauseFollowUpConditional(index, fullData, 'WORSENED'),
      charcount: true,
    }),
    vaMistreatmentDescription: textareaUI({
      title:
        'Briefly describe the injury or event while you were under VA care that caused your disability.',
      hideIf: (_formData, index, fullData) =>
        createCauseFollowUpConditional(index, fullData, 'VA'),
      required: (_formData, index, fullData) =>
        !createCauseFollowUpConditional(index, fullData, 'VA'),
      charcount: true,
    }),
    vaMistreatmentLocation: textUI({
      title: 'Tell us where this happened.',
      hideIf: (_formData, index, fullData) =>
        createCauseFollowUpConditional(index, fullData, 'VA'),
      required: (_formData, index, fullData) =>
        !createCauseFollowUpConditional(index, fullData, 'VA'),
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
