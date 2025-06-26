// @ts-check
import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Compensation election'),
    'ui:description': (
      <div>
        <h3>Election statement</h3>
        <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
          <p className="vads-u-margin--0">
            I hereby elect to receive compensation from the Department of
            Veterans Affairs in lieu of the total amount of retired pay, or
            waive that portion of my retired pay which is equal in amount to the
            compensation which may be awarded by the Department of Veterans
            Affairs.
          </p>
        </div>
        <p>
          By providing your information below, you're digitally signing this
          election statement.
        </p>
      </div>
    ),
    signatureDate: currentOrPastDateUI({
      title: 'Date of signature',
    }),
    'view:signatureConfirmation': {
      'ui:description': (
        <div className="vads-u-margin-top--3">
          <VaAlert status="info">
            <h4 slot="headline">Important information about this election</h4>
            <div>
              <p>
                This election is typically a one-time decision that affects your
                VA compensation and military retired pay. Please review this
                choice carefully.
              </p>
              <p>
                <strong>
                  By submitting this form, you're making a legal election
                </strong>{' '}
                to receive VA disability compensation instead of an equal amount
                of military retired pay.
              </p>
            </div>
          </VaAlert>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      signatureDate: currentOrPastDateSchema,
      'view:signatureConfirmation': {
        type: 'object',
        properties: {},
      },
    },
    required: ['signatureDate'],
  },
};
