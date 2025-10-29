import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const requireYesConfirmation = (errors, fieldData) => {
  if (fieldData !== true) {
    errors.addError('You must select "Yes" to continue with this form.');
  }
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': "Let's get started",
    'ui:description':
      "Let's confirm VA Form 21-8940 is the right form for your needs",
    confirmationQuestion: {
      ...yesNoUI({
        title:
          'Are you applying for increased unemployability compensation benefits?',
        labels: {
          Y: 'Yes, I confirm',
          N: 'No, I do not confirm',
        },
      }),
      'ui:validations': [requireYesConfirmation],
      'ui:errorMessages': {
        required: 'You must make a selection to proceed.',
      },
      'ui:options': {
        showFieldLabel: true,
      },
    },
    'view:yesNotification': {
      'ui:description': () => (
        <div>
          <p>
            <strong>Important:</strong>
          </p>
          <p>
            Please remember, if you are filing a claim for a new or secondary condition or for increased disability compensation, you will also need to complete the Form 21-526EZ if you haven't done so already.
          </p>
          <p>
            <va-link
              href="/disability/file-disability-claim-form-21-526ez/introduction"
              text="VA Form 21-526EZ"
            />
          </p>
        </div>
      ),
      'ui:options': {
        expandUnder: 'confirmationQuestion',
        expandUnderCondition: true,
      },
    },
    'view:noNotification': {
      'ui:description': () => (
        <div>
          <p>
            <strong>Seems like you need a different form.</strong>
          </p>
          <p>
            Let's get you to the right place! Visit our forms page to find the right one for your needs. Remember, you can always get help from a{' '}
            <va-link
              href="/disability/get-help-filing-claim/"
              text="Veteran Service Organization"
            />
            .
          </p>
          <p>
            <va-link
              href="https://www.va.gov/find-forms/"
              text="Find a VA Form"
            />
          </p>
        </div>
      ),
      'ui:options': {
        expandUnder: 'confirmationQuestion',
        expandUnderCondition: false,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      confirmationQuestion: yesNoSchema,
      'view:yesNotification': {
        type: 'object',
        properties: {}
      },
      'view:noNotification': {
        type: 'object',
        properties: {}
      },
    },
    required: ['confirmationQuestion'],
  },
};
