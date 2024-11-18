import {
  radioSchema,
  radioUI,
  selectSchema,
  selectUI,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CONDITIONS_FIRST } from '../constants';
import { conditionOptions } from '../content/conditionOptions';
import {
  disabilityNameTitle,
  ServiceConnectedDisabilityDescription,
} from '../content/newConditions';
import { causeOptions } from './conditionByConditionPages/cause';
import { createItemName } from './conditionsFirstPages/utils';

const getOtherConditions = (formData, currentIndex) => {
  const otherNewConditions = formData?.conditionsFirst
    ?.filter((_, index) => index !== currentIndex)
    ?.map(item => createItemName(item));

  return [...otherNewConditions];
};

const allCauses = ['NEW', 'SECONDARY', 'WORSENED', 'VA'];
const causesWithoutSecondary = allCauses.filter(cause => cause !== 'SECONDARY');

/** @type {PageSchema} */
export default {
  title: formData => createItemName(formData, true),
  depends: formData => formData.demo === 'CONDITIONS_FIRST',
  path: `new-conditions-${CONDITIONS_FIRST}-follow-up/:index`,
  showPagePerItem: true,
  arrayPath: 'conditionsFirst',
  uiSchema: {
    'ui:title': 'Conditions cause follow up',
    conditionsFirst: {
      items: {
        'ui:title': disabilityNameTitle,
        'ui:options': {
          itemAriaLabel: data => `${data.condition} followup questions`,
        },
        cause: radioUI({
          title: 'What caused your condition?',
          labels: causeOptions,
          options: {
            updateSchema: (formData, _causeSchema, _causeUISchema, index) => ({
              enum: getOtherConditions(formData, index).length
                ? allCauses
                : causesWithoutSecondary,
            }),
          },
        }),
        primaryDescription: textareaUI({
          title:
            'Please briefly describe the injury or exposure that caused your condition. For example, I operated loud machinery while in the service, and this caused me to lose my hearing.',
          required: (formData, index) =>
            formData.conditionsFirst[index]?.cause === 'NEW',
          charcount: true,
          expandUnder: 'cause',
          expandUnderCondition: 'NEW',
        }),
        'view:secondaryFollowUp': {
          causedByCondition: selectUI({
            title:
              'Please choose the disability that caused the new disability you’re claiming here.',
            required: (formData, index) =>
              formData.conditionsFirst[index]?.cause === 'SECONDARY' &&
              getOtherConditions(formData, index).length > 0,
            updateSchema: (formData, _schema, _uiSchema, index) => {
              return selectSchema(getOtherConditions(formData, index));
            },
          }),
          causedByConditionDescription: textareaUI({
            title:
              'Please briefly describe how the disability you selected caused your new disability.',
            required: (formData, index) =>
              formData.conditionsFirst[index]?.cause === 'SECONDARY',
            charcount: true,
          }),
          'ui:options': {
            expandUnder: 'cause',
            expandUnderCondition: 'SECONDARY',
          },
        },
        'view:worsenedFollowUp': {
          worsenedDescription: textareaUI({
            title:
              'Please briefly describe the injury or exposure during your military service that caused your existing disability to get worse.',
            required: (formData, index) =>
              formData.conditionsFirst[index]?.cause === 'WORSENED',
            charcount: true,
          }),
          worsenedEffects: textareaUI({
            title:
              'Please tell us how the disability affected you before your service, and how it affects you now after your service.',
            required: (formData, index) =>
              formData.conditionsFirst[index]?.cause === 'WORSENED',
            charcount: true,
          }),
          'ui:options': {
            expandUnder: 'cause',
            expandUnderCondition: 'WORSENED',
          },
        },
        'view:vaFollowUp': {
          vaMistreatmentDescription: textareaUI({
            title:
              'Please briefly describe the injury or event while you were under VA care that caused your disability.',
            required: (formData, index) =>
              formData.conditionsFirst[index]?.cause === 'VA',
            charcount: true,
          }),
          vaMistreatmentLocation: textareaUI({
            title: 'Please tell us where this happened.',
            required: (formData, index) =>
              formData.conditionsFirst[index]?.cause === 'VA',
            charcount: true,
          }),
          'ui:options': {
            expandUnder: 'cause',
            expandUnderCondition: 'VA',
          },
        },
        'view:serviceConnectedDisabilityDescription': {
          'ui:description': ServiceConnectedDisabilityDescription,
        },
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
          required: ['cause'],
          properties: {
            cause: radioSchema(Object.keys(causeOptions)),
            primaryDescription: {
              type: 'string',
              maxLength: 400,
            },
            'view:secondaryFollowUp': {
              type: 'object',
              properties: {
                causedByCondition: selectSchema(conditionOptions),
                causedByConditionDescription: {
                  type: 'string',
                  maxLength: 400,
                },
              },
            },
            'view:worsenedFollowUp': {
              type: 'object',
              properties: {
                worsenedDescription: {
                  type: 'string',
                  maxLength: 50,
                },
                worsenedEffects: {
                  type: 'string',
                  maxLength: 350,
                },
              },
            },
            'view:vaFollowUp': {
              type: 'object',
              properties: {
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
    },
  },
};
