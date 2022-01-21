// import fullSchema from 'vets-json-schema/dist/XX-123-schema.json';
import definitions from 'vets-json-schema/dist/definitions.json';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import _ from 'lodash';
import environment from 'platform/utilities/environment';
import fullNameUI from 'platform/forms/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';

// const { } = fullSchema.properties;

const { fullName, email } = definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/mock_sip_form`,
  trackingPrefix: 'mock-sip-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'XX-123',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for mock sip benefits.',
    noAuth:
      'Please sign in again to continue your application for mock sip benefits.',
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your mock sip benefits application (XX-123) is in progress.',
      expired:
        'Your saved mock sip benefits application (XX-123) has expired. If you want to apply for mock sip benefits, please start a new application.',
      saved: 'Your mock sip benefits application has been saved.',
    },
  },
  title: 'Mock SIP Form',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: {
            veteranFullName: _.merge(fullNameUI, {
              first: {
                'ui:title': 'First name',
              },
              last: {
                'ui:title': 'Last name',
              },
              middle: {
                'ui:title': 'Middle name',
                'ui:options': {
                  hideEmptyValueInReview: true,
                },
              },
              suffix: {
                'ui:title': 'Suffix',
                'ui:options': {
                  hideEmptyValueInReview: true,
                },
              },
              'ui:order': ['first', 'middle', 'last', 'suffix'],
            }),
            email: emailUI(),
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName: fullName,
              email,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
