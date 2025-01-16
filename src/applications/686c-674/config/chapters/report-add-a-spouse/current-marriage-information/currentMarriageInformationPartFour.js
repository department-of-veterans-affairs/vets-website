import React from 'react';
import {
  radioSchema,
  radioUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
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
    typeOther: textUI({
      title: 'Other type of marriage',
      required: formData =>
        formData?.currentMarriageInformation?.type === 'OTHER',
      expandUnder: 'type',
      expandUnderCondition: 'OTHER',
      showFieldLabel: true,
      keepInPageOnReview: true,
    }),
    'view:marriageTypeInformation': {
      'ui:description': <SupportingEvidenceNeeded />,
    },
  },
};
