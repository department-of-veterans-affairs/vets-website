import React from 'react';
import {
  radioSchema,
  radioUI,
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
        typeOther: currentMarriageInformation.properties.typeOther,
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
      'ui:required': formData =>
        formData?.currentMarriageInformation?.type === 'OTHER',
      'ui:title': 'Other type of marriage',
      'ui:options': {
        expandUnder: 'type',
        expandUnderCondition: 'OTHER',
        showFieldLabel: true,
        keepInPageOnReview: true,
        // widgetClassNames: 'vads-u-margin-y--0',
      },
    },
    'view:marriageTypeInformation': {
      'ui:description': <SupportingEvidenceNeeded />,
    },
  },
};
