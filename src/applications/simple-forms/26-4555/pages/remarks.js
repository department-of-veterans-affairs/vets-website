import React from 'react';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextAreaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Service-connected conditions'),
    remarks: checkboxGroupUI({
      title:
        'Do you have any of these conditions that were caused—or made worse—by your service?',
      required: false,
      labels: {
        respiratoryIllness: 'A severe respiratory (breathing-related) illness',
        blindness: 'Blindness in both eyes (with 20/200 visual acuity or less)',
        lossOfHands: 'Loss or loss of use of both hands',
        lossOfLimbs: 'Loss or loss of use of more than one limb',
        lossOfLegs:
          'Loss or loss of use of a lower leg along with the residuals (lasting effects) of an organic (natural) disease or injury',
        lossOfExtremity:
          'The loss, or loss of use, of one lower extremity (foot or leg) after September 11, 2001, which makes it so you can’t balance or walk without the help of braces, crutches, canes, or a wheelchair',
        burns: 'Severe burns',
      },
    }),
    otherConditions: {
      'ui:title': 'If your conditions aren’t listed, you can write them here:',
      'ui:webComponentField': VaTextAreaField,
    },
    'view:additionalInformation': {
      'ui:description': (
        <va-additional-info uswds trigger="Why we ask for this information?">
          <p>
            We use the information you provide to help decide if you&rsquo;re
            eligible for a grant. To be eligible, you must have a qualifying
            service-connected condition. There are also other factors that
            affect your eligibility.
          </p>
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      remarks: checkboxGroupSchema([
        'respiratoryIllness',
        'blindness',
        'lossOfHands',
        'lossOfLimbs',
        'lossOfLegs',
        'lossOfExtremity',
        'burns',
      ]),
      otherConditions: {
        type: 'string',
      },
      'view:additionalInformation': {
        type: 'object',
        properties: {},
      },
    },
  },
};
