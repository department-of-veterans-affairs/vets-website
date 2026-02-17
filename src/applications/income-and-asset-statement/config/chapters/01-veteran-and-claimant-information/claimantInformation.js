import React from 'react';
import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { SSNReviewField } from '../../../components/SSNReviewField';

/** @type {PageSchema} */
export default {
  title: 'Claimant information',
  path: 'claimant/information',
  depends: formData => {
    return formData?.claimantType !== 'VETERAN';
  },
  uiSchema: {
    ...titleUI('Claimant information'),
    claimantFullName: fullNameNoSuffixUI(title => `Your ${title}`),
    claimantSocialSecurityNumber: {
      ...ssnUI('Your Social Security number'),
      /* eslint-disable react/prop-types */
      'ui:reviewField': ({ children }) => {
        const value = children?.props?.formData;
        const last4Digits = value ? value.slice(-4) : undefined;

        return <SSNReviewField last4Digits={last4Digits} />;
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantSocialSecurityNumber'],
    properties: {
      claimantFullName: fullNameNoSuffixSchema,
      claimantSocialSecurityNumber: ssnSchema,
    },
  },
};
