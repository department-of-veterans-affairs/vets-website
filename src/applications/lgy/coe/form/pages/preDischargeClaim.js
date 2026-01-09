import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaAdditionalInfo,
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/web-components/react-bindings';

const emptyObjectSchema = {
  type: 'object',
  properties: {},
};
const PreDischargeClaimAdditionalInfo = () => (
  <VaAdditionalInfo
    trigger="What is a pre-discharge claim"
    className="vads-u-margin-top--2 vads-u-margin-bottom--4"
  >
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
      Text to be added.
    </p>
  </VaAdditionalInfo>
);
const PreDischargeClaimWhyAccordion = () => (
  <VaAccordion uswds className="vads-u-margin-top--2">
    <VaAccordionItem header="Why are we asking this question?" open>
      <p className="vads-u-margin-top--0">
        The VA funding fee may not be collected from a veteran who rated
        eligible to receive compensation as the result of a pre-discharge
        disability examination and rating or based on a pre-discharge review of
        existing medical evidence (including service medical and treatment
        records) that results in the issuance of a memorandum rating.
      </p>
      <p>
        <a href="/housing-assistance/home-loans/funding-fee-and-closing-costs/">
          Learn more about the VA funding fee
        </a>
      </p>
      <p className="vads-u-margin-bottom--0">
        <strong>Note:</strong> If the proposed or memorandum rating is not
        obtained and a closing takes place, the funding fee exemption does not
        apply, and the service-member will not be entitled to a refund.
      </p>
    </VaAccordionItem>
  </VaAccordion>
);
export default {
  uiSchema: {
    ...titleUI('Pending pre-discharge claim'),
    militaryHistory: {
      preDischargeClaim: yesNoUI({
        title: 'Do you have a pre-discharge claim pending with VA?',
        errorMessages: { required: 'Select yes or no' },
      }),
    },
    'view:preDischargeClaimAdditionalInfo': descriptionUI(
      <PreDischargeClaimAdditionalInfo />,
    ),
    'view:preDischargeClaimWhyAccordion': descriptionUI(
      <PreDischargeClaimWhyAccordion />,
    ),
  },
  schema: {
    type: 'object',
    properties: {
      militaryHistory: {
        type: 'object',
        properties: {
          preDischargeClaim: yesNoSchema,
        },
        required: ['preDischargeClaim'],
      },
      'view:preDischargeClaimAdditionalInfo': emptyObjectSchema,
      'view:preDischargeClaimWhyAccordion': emptyObjectSchema,
    },
  },
};
