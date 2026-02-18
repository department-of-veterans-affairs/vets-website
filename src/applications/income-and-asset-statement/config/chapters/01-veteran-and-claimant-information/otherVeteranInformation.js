import React from 'react';
import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { SSNReviewField } from '../../../components/SSNReviewField';

/** @type {PageSchema} */
export default {
  title: 'Veteran information',
  path: 'veteran/information',
  depends: formData => formData?.claimantType !== 'VETERAN',
  uiSchema: {
    ...titleUI('Veteran information'),
    otherVeteranFullName: fullNameNoSuffixUI(title => `Veteran’s ${title}`),
    otherVeteranSocialSecurityNumber: {
      ...ssnUI('Veteran’s Social Security number'),
      /* eslint-disable react/prop-types */
      'ui:reviewField': ({ children }) => {
        const value = children?.props?.formData;
        const last4Digits = value ? value.slice(-4) : undefined;

        return <SSNReviewField last4Digits={last4Digits} />;
      },
    },
    otherVaFileNumber: vaFileNumberUI('VA File Number (if applicable)'),
  },
  schema: {
    type: 'object',
    required: ['otherVeteranFullName', 'otherVeteranSocialSecurityNumber'],
    properties: {
      otherVeteranFullName: fullNameNoSuffixSchema,
      otherVeteranSocialSecurityNumber: ssnSchema,
      otherVaFileNumber: vaFileNumberSchema,
    },
  },
};
