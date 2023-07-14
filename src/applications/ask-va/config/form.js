// import fullSchema from 'vets-json-schema/dist/XX-230-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import TopicList from '../components/FormFields/TopicList';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'ask-the-va-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '0873',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your ask the va test application (XX-230) is in progress.',
    //   expired: 'Your saved ask the va test application (XX-230) has expired. If you want to apply for ask the va test, please start a new application.',
    //   saved: 'Your ask the va test application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for ask the va test.',
    noAuth:
      'Please sign in again to continue your application for ask the va test.',
  },
  title: 'Ask VA',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Your Info',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: {
            fieldOnAnotherPage: {
              'ui:title': 'Field on Another Page',
            },
            myField: {
              'ui:title': 'My field label test',
              'ui:widget': 'radio',
              'ui:options': {
                widgetProps: {
                  'First option': { 'data-info': 'first_1' },
                  'Second option': { 'data-info': 'second_2' },
                },
                // Only added to the radio when it is selected
                // a11y requirement: aria-describedby ID's *must* exist on the page;
                // and we conditionally add content based on the selection
                selectedProps: {
                  'First option': { 'aria-describedby': 'some_id_1' },
                  'Second option': { 'aria-describedby': 'some_id_2' },
                },
              },
            },
            devField: {
              'ui:widget': TopicList,
            },
            testField: {
              'ui:title': 'My TEST label',
              'ui:validations': [
                (errors, field) => {
                  if (field && field.startsWith('bad')) {
                    errors.addError(
                      "Sorry, you can't start this field with 'bad'",
                    );
                  }
                },
              ],
            },
            thirdField: {
              'ui:title': 'My Third label',
              'ui:errorMessages': {
                pattern: 'Sorry, word MUST start with "good"',
              },
            },
            // To force this field to be required the 'thirdField' must equal 'good'
            myOtherField: {
              'ui:title': 'My Other field',
              'ui:required': formData => formData.thirdField === 'good',
            },
            myConditionalField: {
              'ui:title': 'My conditional field',
              'ui:options': {
                expandUnder: 'myField',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['myField'],
            properties: {
              fieldOnAnotherPage: {
                type: 'string',
              },
              myField: {
                type: 'string',
                enum: ['First Option', 'Second Option'],
              },
              devField: {
                type: 'string',
              },
              myConditionalField: {
                type: 'string',
              },
              testField: {
                type: 'string',
              },
              thirdField: {
                type: 'string',
                pattern: '^good',
              },
              myOtherField: {
                type: 'string',
              },
            },
          },
          page2: {
            path: 'second-page',
            title: 'Second Page',
            depends: form => form.fieldOnAnotherPage !== 'test',
            uiSchema: {
              myFieldPage2: {
                'ui:title': 'My field',
                'ui:widget': 'yesNo',
                'ui:options': {
                  labels: {
                    Y: 'Yes, this is what I want',
                    N: 'No, I do not want this',
                  },
                  widgetProps: {
                    Y: { 'data-info': 'yes' },
                    N: { 'data-info': 'no' },
                  },
                  // Only added to the radio when it is selected
                  // a11y requirement: aria-describedby ID's *must* exist on the page;
                  // and we conditionally add content based on the selection
                  selectedProps: {
                    Y: { 'aria-describedby': 'some_id' },
                    N: { 'aria-describedby': 'different_id' },
                  },
                },
              },
              email: {
                'ui:title': 'Email',
              },
              'view:confirmEmail': {
                'ui:title': 'Confirm email',
              },
            },
            schema: {
              type: 'object',
              properties: {
                myFieldPage2: {
                  type: 'boolean',
                },
                email: {
                  type: 'string',
                },
                'view:confirmEmail': {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      chapter2: {
        title: 'Your Question',
        pages: {
          page3: {
            path: 'your-question-page',
            title: 'The Questions Page',
            uiSchema: {
              question: {
                'ui:title': 'Type your question below:',
                'ui:widget': 'textarea',
              },
            },
            schema: {
              type: 'object',
              required: ['question'],
              properties: {
                question: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
