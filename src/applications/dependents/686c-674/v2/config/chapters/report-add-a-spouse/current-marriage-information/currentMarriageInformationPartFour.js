import React from 'react';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { marriageTypeLabels, marriageTypeArr } from './helpers';
import { SpouseEvidencePreparation } from '../../../../components/SpouseEvidencePreparation';

export const schema = {
  type: 'object',
  properties: {
    currentMarriageInformation: {
      type: 'object',
      properties: {
        typeOfMarriage: radioSchema(marriageTypeArr),
        typeOther: {
          type: 'string',
        },
        'view:marriageTypeInformation': {
          type: 'object',
          properties: {},
        },
      },
      required: ['typeOfMarriage'],
    },
  },
};

export const uiSchema = {
  currentMarriageInformation: {
    typeOfMarriage: radioUI({
      title: 'How did you get married?',
      labels: marriageTypeLabels,
      labelHeaderLevel: '3',
      errorMessages: {
        required: 'Select the type of marriage',
      },
      classNames: 'vads-u-margin-bottom--2 vads-u-margin-top--5',
    }),
    typeOther: {
      'ui:title': 'Other type of marriage',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'typeOfMarriage',
        expandUnderCondition: 'OTHER',
        expandedContentFocus: true,
        preserveHiddenData: true,
      },
    },
    'view:marriageTypeInformation': {
      'ui:description': <SpouseEvidencePreparation />,
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.typeOther['ui:collapsed']) {
          return { ...formSchema, required: ['typeOfMarriage'] };
        }
        return {
          ...formSchema,
          required: ['typeOfMarriage', 'typeOther'],
        };
      },
    },
  },
};
