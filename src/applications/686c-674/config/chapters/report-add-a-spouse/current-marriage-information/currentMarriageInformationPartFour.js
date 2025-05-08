import React from 'react';
import {
  radioSchema,
  radioUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import VaTextInputField from '@department-of-veterans-affairs/platform-forms-system/web-component-fields/VaTextInputField';
import { addSpouse } from '../../../utilities';
import {
  marriageTypeLabels,
  marriageTypeArr,
  SupportingEvidenceNeeded,
} from './helpers';

const { currentMarriageInformation } = addSpouse.properties;

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
        'view:marriageTypeInformation':
          currentMarriageInformation.properties['view:marriageTypeInformation'],
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
      'ui:description': <SupportingEvidenceNeeded />,
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
