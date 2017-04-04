// import _ from 'lodash/fp';

// import fullSchema1990n from 'vets-json-schema/dist/ncs-benefits-schema.json';

// import pages from '../../pages/';

// import definitions from '../../definitions/';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform
} from '../helpers';
//
// const {
// } = fullSchema1990n.properties;
//
// const {
// } = fullSchema1990n.definitions;

const formConfig = {
  urlPrefix: '/1990n/',
  submitUrl: '/v0/education_benefits_claims/1990n',
  trackingPrefix: 'edu-1990n-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
  },
  title: 'Apply for education benefits under the National Call to Service program',
  subTitle: 'Form 22-1990n',
  chapters: {}
};

export default formConfig;
