// import fullSchema526 from 'vets-json-schema/dist/21-526-schema.json';


import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform
} from '../helpers';


const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/21-526',
  trackingPrefix: 'disability-526-',
  formId: '21-526',
  version: 1,
  migrations: [],
  savedFormMessages: {
    notFound: 'Please start over to apply for disability claims increase.',
    noAuth: 'Please sign in again to resume your application for disability claims increase.'
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {},
  title: 'Disability Claims for Increase',
  subTitle: 'Form 21-526',
  // getHelp: GetFormHelp,
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {}
    },
    benefitSelection: {
      title: 'Benefit Selection',
      pages: {}
    },
    sponsorInformation: {
      title: 'Sponsor Information',
      pages: {}
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {}
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {}
    }
  }
};


export default formConfig;
