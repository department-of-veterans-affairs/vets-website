import {
  selectSchema,
  selectUI,
  textareaUI,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CONDITIONS_FIRST } from '../constants';
import { conditionOptions } from '../content/conditionOptions';
import {
  arrayBuilderOptions,
  createItemName,
} from './conditionsFirstPages/utils';
import { createCauseFollowUpTitles } from './conditionByConditionPages/causeFollowUp';

const getOtherConditions = (formData, currentIndex) => {
  const otherNewConditions = formData?.[arrayBuilderOptions.arrayPath]
    ?.filter((_, index) => index !== currentIndex)
    ?.map(item => createItemName(item));

  return [...otherNewConditions];
};

const createCauseFollowUpConditional = (formData, index, causeType) => {
  return formData?.[arrayBuilderOptions.arrayPath][index]?.cause !== causeType;
};

/** @type {PageSchema} */
export default {
  title: formData => createCauseFollowUpTitles(formData),
  depends: formData => formData.demo === 'CONDITIONS_FIRST',
  path: `new-conditions-${CONDITIONS_FIRST}-follow-up-cause-description/:index`,
  showPagePerItem: true,
  arrayPath: 'conditionsFirst',
  uiSchema: {
    'ui:title': 'Conditions follow up - Cause description',
    conditionsFirst: {
      items: {
        ...titleUI(({ formData }) => createCauseFollowUpTitles(formData)),
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
          title:
            'Briefly describe how this disability caused your new condition.',
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
    },
  },
  schema: {
    type: 'object',
    properties: {
      conditionsFirst: {
        type: 'array',
        items: {
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
      },
    },
  },
};
