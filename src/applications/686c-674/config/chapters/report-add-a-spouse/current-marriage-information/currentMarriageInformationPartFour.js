import React from 'react';
import {
  radioSchema,
  radioUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
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
        type: radioSchema(marriageTypeArr),
        typeOther: textSchema,
        'view:marriageTypeInformation':
          currentMarriageInformation.properties['view:marriageTypeInformation'],
      },
    },
  },
};

export const uiSchema = {
  currentMarriageInformation: {
    type: radioUI({
      title: 'How did you get married?',
      labels: marriageTypeLabels,
      required: () => true,
      labelHeaderLevel: '3',
      errorMessages: {
        required: 'Select the type of marriage',
      },
      classNames: 'vads-u-margin-bottom--2 vads-u-margin-top--5',
    }),
    typeOther: {
      'ui:title': 'Other type of marriage',
      'ui:webComponentField': VaTextInputField,
      'ui:required': formData =>
        formData?.currentMarriageInformation?.type === 'OTHER',
      expandUnder: 'type',
      expandUnderCondition: 'OTHER',
      preserveHiddenData: true,
      showFieldLabel: true,
      keepInPageOnReview: true,
      hideIf: formData =>
        formData?.currentMarriageInformation?.type !== 'OTHER',
    },
    'view:marriageTypeInformation': {
      'ui:description': <SupportingEvidenceNeeded />,
    },
  },
};
