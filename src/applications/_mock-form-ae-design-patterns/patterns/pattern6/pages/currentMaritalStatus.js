import React from 'react';
import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const maritalStatusOptions = {
  MARRIED: 'Married',
  DIVORCED: 'Divorced or annulled',
  WIDOWED: 'Widowed',
  SEPARATED: 'Separated',
  NEVER_MARRIED: 'Never Married',
};

const MaritalStatusDescription = (
  <va-additional-info
    trigger="Why we ask this information"
    class="vads-u-margin-top--2 vads-u-margin-bottom--3"
    uswds
  >
    <div>
      <p className="vads-u-margin-top--0">
        [Language should be specific to the form. As an example, Form 10-10EZ
        says:] We want to make sure we understand your household’s financial
        information to better determine what health care benefits you can get.
        If you’re married, we also need to understand your spouse’s financial
        information.
      </p>
    </div>
  </va-additional-info>
);

/** @type {PageSchema} */
export default {
  title: 'Current marital status',
  path: 'current-marital-status',
  uiSchema: {
    maritalStatus: radioUI({
      title: 'What is your current marital status?',
      labels: maritalStatusOptions,
      description: (
        <span className="vads-u-color--gray-medium">
          If you're in a civil union or common law marriage that's recognized by
          the state the union took place in, select Married.{' '}
        </span>
      ),
    }),
    'view:maritalStatusInfo': {
      'ui:description': MaritalStatusDescription,
    },
  },
  schema: {
    type: 'object',
    required: ['maritalStatus'],
    properties: {
      maritalStatus: radioSchema(Object.keys(maritalStatusOptions)),
      'view:maritalStatusInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
