import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/web-components/react-bindings';

const emptyObjectSchema = {
  type: 'object',
  properties: {},
};
const PurpleHeartWhyAccordion = () => (
  <VaAccordion uswds className="vads-u-margin-top--2">
    <VaAccordionItem header="Why are we asking this question?" open>
      <p className="vads-u-margin-top--0">
        The VA funding fee may not be collected from a member of the Armed
        Forces who is currently serving on active duty and has been awarded the
        Purple Heart.
      </p>
      <p>
        <a href="/housing-assistance/home-loans/funding-fee-and-closing-costs/">
          Learn more about the VA funding fee
        </a>
      </p>
      <p>
        You may be asked to provide evidence of having been awarded the Purple
        Heart later in this form.
      </p>
      <p className="vads-u-margin-bottom--0">
        <strong>Note:</strong> Activations under Title 32 orders are not
        considered active duty for the purpose of funding fee exemption.
      </p>
    </VaAccordionItem>
  </VaAccordion>
);
export default {
  uiSchema: {
    ...titleUI('Purple Heart recipient'),
    militaryHistory: {
      purpleHeartRecipient: yesNoUI({
        title: 'Are you a Purple Heart recipient?',
        errorMessages: { required: 'Select yes or no' },
      }),
    },
    'view:purpleHeartWhyAccordion': descriptionUI(<PurpleHeartWhyAccordion />),
  },
  schema: {
    type: 'object',
    properties: {
      militaryHistory: {
        type: 'object',
        properties: {
          purpleHeartRecipient: yesNoSchema,
        },
        required: ['purpleHeartRecipient'],
      },
      'view:purpleHeartWhyAccordion': emptyObjectSchema,
    },
  },
};
