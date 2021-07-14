import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  basicInformation,
  location,
  organizationName,
  search,
} from './imports';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'search-representative-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-22a',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for search for a representative.',
    noAuth:
      'Please sign in again to continue your application for search for a representative.',
  },
  title: 'Find an accredited representative',
  defaultDefinitions: {},
  chapters: {
    basicInformation: {
      title: '',
      pages: {
        representativeType: {
          path: 'representstive-type',
          uiSchema: basicInformation.uiSchema,
          schema: basicInformation.schema,
        },
        location: {
          path: 'location',
          uiSchema: location.uiSchema,
          schema: location.schema,
        },
        organizationName: {
          path: 'organization-name',
          uiSchema: organizationName.uiSchema,
          schema: organizationName.schema,
        },
        searchRepresentative: {
          path: 'search-for-representative',
          uiSchema: search.uiSchema,
          schema: search.schema,
        },
      },
    },
  },
};

export default formConfig;
