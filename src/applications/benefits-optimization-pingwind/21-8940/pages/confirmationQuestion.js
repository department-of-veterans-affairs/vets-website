import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title':
      "Let's confirm VA Form 21-8940 is the right form for your needs",
    confirmationQuestion: {
      ...yesNoUI({
        title:
          'Are you applying for increased unemployability compensation benefits?',
        labels: {
          Y: 'Yes, I confirm',
          N: 'No, I do not confirm',
        },
        errorMessages: {
          required: 'You must make a selection to proceed.',
        },
        showFieldLabel: true,
      }),
    },
    newConditionQuestion: {
      ...yesNoUI({
        title: 'Are you applying for a new or secondary condition?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        errorMessages: {
          required: 'You must make a selection to proceed.',
        },
        showFieldLabel: true,
      }),
      'ui:options': {
        expandUnder: 'confirmationQuestion',
        expandUnderCondition: false,
      },
      'ui:validations': [
        (errors, fieldData) => {
          if (fieldData === false) {
            errors.addError(
              'You must select "Yes" to continue with this form.',
            );
          }
        },
      ],
    },
    'view:yesNotification': {
      'ui:description': () => (
        <va-alert status="info" uswds>
          <h3 slot="headline">Important</h3>
          <p>
            Please remember, if you are filing a claim for a new or secondary
            condition or for increased disability compensation, you will also
            need to complete the Form 21-526EZ if you haven't done so already.
          </p>
          <p>
            <va-link
              href="/disability/file-disability-claim-form-21-526ez/introduction"
              text="VA Form 21-526EZ"
            />
          </p>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData =>
          formData.confirmationQuestion !== false ||
          formData.newConditionQuestion !== true,
      },
    },
    'view:noNotification': {
      'ui:description': () => (
        <va-alert status="warning" uswds>
          <h3 slot="headline">Seems like you need a different form.</h3>
          <p>
            Let's get you to the right place! Visit our forms page to find the
            right one for your needs. Remember, you can always get help from a{' '}
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
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData =>
          formData.confirmationQuestion !== false ||
          formData.newConditionQuestion !== false,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      confirmationQuestion: yesNoSchema,
      newConditionQuestion: yesNoSchema,
      'view:yesNotification': {
        type: 'object',
        properties: {},
      },
      'view:noNotification': {
        type: 'object',
        properties: {},
      },
    },
    required: ['confirmationQuestion'],
  },
};
