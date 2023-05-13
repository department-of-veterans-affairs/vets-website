import React from 'react';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">
        Service-connected conditions
      </h3>
    ),
    remarks: {
      'ui:title': (
        <p className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
          Do you have any of these conditions that were caused&mdash;or made
          worse&mdash;by your service?
        </p>
      ),
      respiratoryIllness: {
        'ui:title': 'A severe respiratory (breathing-related) illness',
      },
      blindness: {
        'ui:title':
          'Blindness in both eyes (with 20/200 visual acuity or less)',
      },
      lossOfHands: {
        'ui:title': 'Loss or loss of use of both hands',
      },
      lossOfLimbs: {
        'ui:title': 'Loss or loss of use of more than one limb',
      },
      lossOfLegs: {
        'ui:title':
          'Loss or loss of use of a lower leg along with the residuals (lasting effects) of an organic (natural) disease or injury',
      },
      lossOfExtremity: {
        'ui:title':
          'The loss, or loss of use, of one lower extremity (foot or leg) after September 11, 2001, which makes it so you can’t balance or walk without the help of braces, crutches, canes, or a wheelchair',
      },
      burns: {
        'ui:title': 'Severe burns',
      },
      otherConditions: {
        'ui:title':
          'If your conditions aren’t listed, you can write them here:',
        'ui:widget': 'textarea',
      },
    },
    'view:additionalInformation': {
      'ui:description': (
        <va-additional-info trigger="Why we ask for this information?">
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
      remarks: {
        type: 'object',
        properties: {
          respiratoryIllness: {
            type: 'boolean',
          },
          blindness: {
            type: 'boolean',
          },
          lossOfHands: {
            type: 'boolean',
          },
          lossOfLimbs: {
            type: 'boolean',
          },
          lossOfLegs: {
            type: 'boolean',
          },
          lossOfExtremity: {
            type: 'boolean',
          },
          burns: {
            type: 'boolean',
          },
          otherConditions: {
            type: 'string',
          },
        },
      },
      'view:additionalInformation': {
        type: 'object',
        properties: {},
      },
    },
  },
};
