// import fullSchema from 'vets-json-schema/dist/21-526EZ-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { addDisabilitiesRevised } from '../../disability-benefits/all-claims/pages';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'add-disability-testing-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-526EZ',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your conditions testing application (21-526EZ) is in progress.',
    //   expired: 'Your saved conditions testing application (21-526EZ) has expired. If you want to apply for conditions testing, please start a new application.',
    //   saved: 'Your conditions testing application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for conditions testing.',
    noAuth:
      'Please sign in again to continue your application for conditions testing.',
  },
  title: 'File for disability compensation',
  defaultDefinitions: {},
  chapters: {
    disabilities: {
      title: 'Conditions',
      pages: {
        addDisabilitiesRevised: {
          title: 'Conditions',
          path: 'testing-page',
          uiSchema: addDisabilitiesRevised.uiSchema,
          schema: addDisabilitiesRevised.schema,
          updateFormData: addDisabilitiesRevised.updateFormData,
          appStateSelector: state => ({
            // needed for validateDisabilityName to work properly on the review
            // & submit page. Validation functions are provided the pageData and
            // not the formData on the review & submit page. For more details
            // see https://dsva.slack.com/archives/CBU0KDSB1/p1614182869206900
            newDisabilities: state.form?.data?.newDisabilities || [],
          }),
        },
      },
    },
  },
};

export default formConfig;
