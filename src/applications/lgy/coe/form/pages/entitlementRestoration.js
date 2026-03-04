import React from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaAccordion,
  VaAccordionItem,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { entitlementRestorationOptions } from '../constants';
import { PropertyAddress } from '../components/PropertyAddress';

const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

const EntitlementRestorationOptions = () => (
  <VaAccordion className="vads-u-margin-top--2" openSingle>
    <VaAccordionItem header="Understanding your VA loan entitlement restoration options">
      <p className="vads-u-margin-top--0">
        Here’s what you should know about entitlement restorations.
      </p>

      <p className="vads-u-margin-bottom--0 vads-u-font-weight--bold">
        One-time restoration
      </p>
      <p className="vads-u-margin-top--0">
        You can request a one-time entitlement restoration if you want to
        purchase another primary residence. You must have paid off the original
        VA home loan, still own the home, or sold it before we restore
        entitlement.
      </p>

      <p className="vads-u-margin-bottom--0 vads-u-font-weight--bold">
        Cash-out refinance programs
      </p>
      <p className="vads-u-margin-top--0">
        You can request an entitlement restoration so that can refinance your
        home and cash out part of your equity. You can do this even if your
        current mortgage isn’t through the VA home loan program.{' '}
        <VaLink
          external
          href="https://www.va.gov/housing-assistance/home-loans/loan-types/cash-out-loan/"
          text="Learn more about a Cash-out refinance loan"
        />
      </p>

      <p className="vads-u-margin-bottom--0 vads-u-font-weight--bold">
        Refinance to change my interest rate
      </p>
      <p className="vads-u-margin-top--0">
        You can request an entitle restoration to refinance your current VA home
        loan to get a lower interest rate with the Interest Rate Reduction
        Refinance Loan (IRRRL) program. You can also use this program to switch
        from an adjustable rate to a fixed rate.{' '}
        <VaLink
          external
          href="https://www.va.gov/housing-assistance/home-loans/loan-types/interest-rate-reduction-loan/"
          text="Learn more about IRRRL"
        />
      </p>
    </VaAccordionItem>
  </VaAccordion>
);

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Property with VA home loan: Entitlement restoration',
      ({ formData }) => (
        <div>
          <p>
            Restoring your VA home loan entitlement can let you use your
            entitlement again for future VA‑backed loans if the VA home loan on
            this property is paid off.
          </p>
          <PropertyAddress formData={formData} />
        </div>
      ),
    ),
    entitlementRestoration: radioUI({
      title:
        'Do you want to make this property’s VA benefit available to use on a different home or in a different way?',
      labels: {
        [entitlementRestorationOptions.ENTITLEMENT_INQUIRY_ONLY]:
          'No, I’m just checking my entitlement',
        [entitlementRestorationOptions.ONE_TIME_RESTORATION]:
          'Yes, I want a one-time restoration',
        [entitlementRestorationOptions.CASH_OUT_REFINANCE]:
          'Yes, I want to refinance and take cash out',
        [entitlementRestorationOptions.INTEREST_RATE_REDUCTION_REFINANCE]:
          'Yes, I want to refinance to change my interest rate',
      },
    }),
    'view:entitlementRestorationOptions': descriptionUI(
      <EntitlementRestorationOptions />,
    ),
  },
  schema: {
    type: 'object',
    properties: {
      entitlementRestoration: radioSchema([
        entitlementRestorationOptions.ENTITLEMENT_INQUIRY_ONLY,
        entitlementRestorationOptions.ONE_TIME_RESTORATION,
        entitlementRestorationOptions.CASH_OUT_REFINANCE,
        entitlementRestorationOptions.INTEREST_RATE_REDUCTION_REFINANCE,
      ]),
      'view:entitlementRestorationOptions': emptyObjectSchema,
    },
    required: ['entitlementRestoration'],
  },
};
