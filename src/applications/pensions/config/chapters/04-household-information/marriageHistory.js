import get from 'platform/utilities/data/get';
import merge from 'lodash/merge';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  currentOrPastDateUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateAfterMarriageDate } from '../../../validation';
import { marriageTypeLabels, separationTypeLabels } from '../../../labels';
import {
  getMarriageTitleWithCurrent,
  MarriageTitle,
  isCurrentMarriage,
  hasMarriageHistory,
} from './helpers';

const dateSchema = {
  pattern: '^\\d{4}-\\d{2}-\\d{2}$',
  type: 'string',
};

/** @type {PageSchema} */
export default {
  title: (form, { pagePerItemIndex } = { pagePerItemIndex: 0 }) =>
    getMarriageTitleWithCurrent(form, pagePerItemIndex),
  path: 'household/marriages/:index',
  depends: hasMarriageHistory,
  showPagePerItem: true,
  arrayPath: 'marriages',
  uiSchema: {
    marriages: {
      items: {
        'ui:options': {
          updateSchema: (form, schema, uiSchema, index) => {
            return {
              title: MarriageTitle(getMarriageTitleWithCurrent(form, index)),
            };
          },
        },
        spouseFullName: fullNameNoSuffixUI(title => `Spouse’s ${title}`),
        'view:currentMarriage': {
          'ui:options': {
            hideIf: (form, index) => !isCurrentMarriage(form, index),
          },
          dateOfMarriage: merge(
            {},
            currentOrPastDateUI({
              title: 'Date of marriage',
              dataDogHidden: true,
            }),
            {
              'ui:required': (...args) => isCurrentMarriage(...args),
            },
            {
              'ui:options': {
                classNames: 'schemaform-date-input-v3',
              },
            },
          ),
          locationOfMarriage: {
            'ui:title': 'Place of marriage',
            'ui:options': {
              hint: 'City and state or foreign country',
            },
            'ui:webComponentField': VaTextInputField,
            'ui:required': (...args) => isCurrentMarriage(...args),
          },
          marriageType: radioUI({
            title: 'How did you get married?',
            labels: marriageTypeLabels,
            classNames: 'vads-u-margin-bottom--2',
            required: (...args) => isCurrentMarriage(...args),
          }),
          otherExplanation: {
            'ui:title': 'Tell us how you got married',
            'ui:webComponentField': VaTextInputField,
            'ui:required': (form, index) =>
              get(
                ['marriages', index, 'view:currentMarriage', 'marriageType'],
                form,
              ) === 'OTHER',
            'ui:options': {
              hint:
                'You can enter common law, proxy (someone else represented you or your spouse at your marriage ceremony), tribal ceremony, or another way.',
              expandUnder: 'marriageType',
              expandUnderCondition: 'OTHER',
            },
          },
        },
        'view:pastMarriage': {
          'ui:options': {
            hideIf: isCurrentMarriage,
          },
          reasonForSeparation: radioUI({
            title: 'How did the marriage end?',
            labels: separationTypeLabels,
            classNames: 'vads-u-margin-bottom--2',
            required: (...args) => !isCurrentMarriage(...args),
          }),
          otherExplanation: {
            'ui:title': 'Tell us how the marriage ended',
            'ui:webComponentField': VaTextInputField,
            'ui:required': (form, index) =>
              get(
                [
                  'marriages',
                  index,
                  'view:pastMarriage',
                  'reasonForSeparation',
                ],
                form,
              ) === 'OTHER',
            'ui:options': {
              expandUnder: 'reasonForSeparation',
              expandUnderCondition: 'OTHER',
              classNames: 'vads-u-margin-bottom--2',
            },
          },
          dateOfMarriage: merge(
            {},
            currentOrPastDateUI({
              title: 'Date of marriage',
              dataDogHidden: true,
            }),
            {
              'ui:required': (...args) => !isCurrentMarriage(...args),
            },
            {
              'ui:options': {
                classNames: 'schemaform-date-input-v3',
              },
            },
          ),
          dateOfSeparation: merge(
            {},
            currentOrPastDateUI({
              title: 'Date marriage ended',
              dataDogHidden: true,
            }),
            {
              'ui:required': (...args) => !isCurrentMarriage(...args),
            },
            {
              'ui:validations': [validateAfterMarriageDate],
            },
            {
              'ui:options': {
                classNames: 'schemaform-date-input-v3',
              },
            },
          ),
          locationOfMarriage: {
            'ui:title': 'Place of marriage',
            'ui:webComponentField': VaTextInputField,
            'ui:options': {
              hint: 'City and state or foreign country',
            },
            'ui:required': (...args) => !isCurrentMarriage(...args),
          },
          locationOfSeparation: {
            'ui:title': 'Place marriage ended',
            'ui:webComponentField': VaTextInputField,
            'ui:options': {
              hint: 'City and state or foreign country',
            },
            'ui:required': (...args) => !isCurrentMarriage(...args),
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      marriages: {
        type: 'array',
        items: {
          type: 'object',
          required: ['spouseFullName'],
          properties: {
            spouseFullName: fullNameNoSuffixSchema,
            'view:currentMarriage': {
              type: 'object',
              properties: {
                dateOfMarriage: dateSchema,
                locationOfMarriage: { type: 'string' },
                marriageType: radioSchema(Object.keys(marriageTypeLabels)),
                otherExplanation: { type: 'string' },
              },
            },
            'view:pastMarriage': {
              type: 'object',
              properties: {
                reasonForSeparation: radioSchema(
                  Object.keys(separationTypeLabels),
                ),
                otherExplanation: { type: 'string' },
                dateOfMarriage: dateSchema,
                dateOfSeparation: dateSchema,
                locationOfMarriage: { type: 'string' },
                locationOfSeparation: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};
