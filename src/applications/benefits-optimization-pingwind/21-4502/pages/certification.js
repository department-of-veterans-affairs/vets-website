import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  checkboxRequiredSchema,
  checkboxUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Certification and signature'),
    'ui:description': (
      <div>
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h2 slot="headline">Application statement</h2>
          <p className="vads-u-margin--0">
            By signing, you certify that you will obtain proper licensing to
            operate the vehicle or conveyance, and that VA has not previously
            paid an automobile grant on your behalf (or that 30 or more years
            have passed since the last grant).
          </p>
        </VaAlert>
        <div className="vads-u-margin-top--5">
          <p className="vads-u-font-weight--bold vads-u-margin-top--0">
            Please read and certify the following.
          </p>
        </div>
      </div>
    ),
    'ui:order': [
      'certifyLicensing',
      'certifyNoPriorGrant',
      'view:penaltyAlert',
    ],
    'view:penaltyAlert': {
      'ui:field': 'ViewField',
      'ui:description': (
        <VaAlert status="warning" class="vads-u-margin-top--3" uswds visible>
          <h2 slot="headline" className="vads-u-font-weight--bold">
            Penalty
          </h2>
          <p className="vads-u-margin--0">
            The law provides severe penalties which include fine or imprisonment
            or both for the willful submission of any statement or evidence of a
            material fact, knowing it to be false, or for the fraudulent
            acceptance of any payment to which you are not entitled.
          </p>
        </VaAlert>
      ),
    },
    certifyLicensing: checkboxUI({
      title:
        'I certify that I will obtain proper licensing to operate the vehicle or conveyance.',
      required: () => true,
      classNames:
        'vads-u-background-color--gray-lightest vads-u-padding--4 vads-u-margin-bottom--4',
      errorMessages: {
        enum: 'You must certify to continue.',
        required: 'You must certify to continue.',
      },
      label: 'I certify that I will obtain proper licensing.',
    }),
    certifyNoPriorGrant: checkboxUI({
      title:
        'I certify that VA has not previously paid an automobile grant on my behalf, or that 30 or more years have passed since the last grant.',
      required: () => true,
      classNames:
        'vads-u-background-color--gray-lightest vads-u-padding--4 vads-u-margin-bottom--4',
      errorMessages: {
        enum: 'You must certify to continue.',
        required: 'You must certify to continue.',
      },
      label: 'I certify regarding prior automobile grant.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      certifyLicensing: checkboxRequiredSchema,
      certifyNoPriorGrant: checkboxRequiredSchema,
      'view:penaltyAlert': { type: 'object', properties: {} },
    },
    required: ['certifyLicensing', 'certifyNoPriorGrant'],
  },
};
