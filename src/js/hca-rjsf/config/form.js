// import fullSchemaHca from 'vets-json-schema/dist/hca-schema.json';

import { transform } from '../helpers';

import IntroductionPage from '../components/IntroductionPage';

const formConfig = {
  urlPrefix: '/rjsf/',
  submitUrl: '',
  trackingPrefix: 'hca-rjsf-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  title: 'Apply for health care',
  subTitle: 'Form 10-10ez',
  chapters: {
    veteranInformation: {
      title: 'Veteran information',
      pages: {
      }
    }
  }
};

export default formConfig;
