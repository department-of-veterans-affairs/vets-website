// import _ from 'lodash/fp';

// import fullSchema1990 from 'vets-json-schema/dist/22-1990-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform
} from '../helpers';

const formConfig = {
  urlPrefix: '/1990-rjsf/',
  submitUrl: '/v0/education_benefits_claims/1990',
  trackingPrefix: 'edu-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
  },
  title: 'Apply for education benefits',
  subTitle: 'Form 22-1990',
  chapters: {
  }
};

export default formConfig;
