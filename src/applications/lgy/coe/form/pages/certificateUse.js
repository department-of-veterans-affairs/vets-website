import React from 'react';
import {
  descriptionUI,
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaAccordion,
  VaAccordionItem,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { certificateUseOptions } from '../constants';

const OptionsAccordion = () => (
  <VaAccordion className="vads-u-margin-top--2">
    <VaAccordionItem header="Understanding your COE options">
      <p className="vads-u-margin-y--0 vads-u-font-weight--bold">
        Check your eligibility
      </p>
      <p className="vads-u-margin-top--0">
        Find out if you’re eligible and how much entitlement you have.
      </p>

      <p className="vads-u-margin-bottom--0 vads-u-font-weight--bold">
        Purchase a home
      </p>
      <p className="vads-u-margin-top--0">Buy a home using a VA home loan.</p>

      <p className="vads-u-margin-bottom--0 vads-u-font-weight--bold">
        Refinance and take cash out
      </p>
      <p className="vads-u-margin-top--0">
        Refinance your home and take cash out from your equity, even if you
        didn’t buy it using a VA home loan.{' '}
        <VaLink
          external
          href="https://www.va.gov/housing-assistance/home-loans/loan-types/cash-out-loan/"
          text="Learn more about the cash-out refinance program"
        />
      </p>

      <p className="vads-u-margin-bottom--0 vads-u-font-weight--bold">
        Refinance to change interest rate
      </p>
      <p className="vads-u-margin-top--0">
        Lower your interest rate or switch from an adjustable rate to a fixable
        rate with the Interest Rate Reduction Refinance Loan (IRRRL) program.{' '}
        <VaLink
          external
          href="https://www.va.gov/housing-assistance/home-loans/loan-types/interest-rate-reduction-loan/"
          text="Learn more about the IRRRL program"
        />
      </p>
    </VaAccordionItem>
  </VaAccordion>
);

const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

export default {
  uiSchema: {
    ...titleUI('Certificate use'),
    loanHistory: {
      certificateUse: radioUI({
        title: 'What do you need your COE for?',
        labels: {
          [certificateUseOptions.ENTITLEMENT_INQUIRY_ONLY]:
            'To check my eligibility only',
          [certificateUseOptions.HOME_PURCHASE]: 'To purchase a home',
          [certificateUseOptions.CASH_OUT_REFINANCE]:
            'To refinance and take out cash',
          [certificateUseOptions.INTEREST_RATE_REDUCTION_REFINANCE]:
            'To refinance and change my interest rate',
        },
      }),
    },
    'view:optionsAccordion': descriptionUI(<OptionsAccordion />),
  },
  schema: {
    type: 'object',
    properties: {
      loanHistory: {
        type: 'object',
        properties: {
          certificateUse: radioSchema([
            certificateUseOptions.ENTITLEMENT_INQUIRY_ONLY,
            certificateUseOptions.HOME_PURCHASE,
            certificateUseOptions.CASH_OUT_REFINANCE,
            certificateUseOptions.INTEREST_RATE_REDUCTION_REFINANCE,
          ]),
        },
        required: ['certificateUse'],
      },
      'view:optionsAccordion': emptyObjectSchema,
    },
  },
};
