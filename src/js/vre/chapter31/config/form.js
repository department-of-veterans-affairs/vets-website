import _ from 'lodash/fp';

import fullSchema31 from 'vets-json-schema/dist/28-1900-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
} = fullSchema31.properties;

const {
} = fullSchema31.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/vre',
  trackingPrefix: 'vre-chapter-31',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '28-1900',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: '',
    noAuth: ''
  },
  title: '',
  subTitle: 'Form 28-1900',
  defaultDefinitions: {
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
    },
    militaryHistory: {
      title: 'Military History',
    },
    workInformation: {
      title: 'Work Information',
    },
    educationAndVREInformation: {
      title: 'Education and Vocational Rehab Information',
    },
    disabilityInformation: {
      title: 'Disability Information',
    },
    contactInformation: {
      title: 'Contact Information',
    },
};


export default formConfig;
