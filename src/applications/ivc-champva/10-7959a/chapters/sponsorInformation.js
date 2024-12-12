import React from 'react';
import { cloneDeep } from 'lodash';
import {
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const blankSchema = { type: 'object', properties: {} };

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

const sponsorHint = (
  <>
    You selected that you’re the Veteran filling out this form for your spouse
    or dependant. This means that you’re their sponsor (this is the Veteran or
    service member the beneficiary is connected to).
    <br />
    <br />
    Enter your information here. We’ll use this information to confirm the
    beneficiary’s eligibility.
  </>
);

const otherHint = addressee =>
  `Enter the information for the sponsor (this is the Veteran or service member ${
    addressee[0]
  } connected to). We’ll use the sponsor’s information to confirm ${
    addressee[1]
  } eligibility.`;

export const sponsorNameSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => {
        const isSponsor = formData?.certifierRole === 'sponsor';
        return `${isSponsor ? 'Your' : 'Sponsor’s'} name`;
      },
      ({ formData }) => {
        const isSponsor = formData?.certifierRole === 'sponsor';
        const isBeneficiary = formData?.certifierRole === 'applicant';
        const addressee = isBeneficiary
          ? ['you are', 'your']
          : ['the beneficiary is', 'the beneficiary’s'];

        return <>{isSponsor ? sponsorHint : otherHint(addressee)}</>;
      },
    ),
    sponsorName: fullNameMiddleInitialUI,
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      sponsorName: fullNameSchema,
    },
  },
};
