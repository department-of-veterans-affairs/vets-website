// import _ from 'lodash/fp';

// import { transform } from '../helpers';
// import fullSchema36 from 'vets-json-schema/dist/28-8832-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema36.properties;
//
// const { } = fullSchema36.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/vre',
  trackingPrefix: 'vre-chapter-36',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '28-8832',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for vocational counseling.',
    noAuth: 'Please sign in again to resume your application for vocational counseling.'
  },
  title: 'Apply for vocational counseling',
  subTitle: 'Form 28-8832',
  defaultDefinitions: {},
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
      }
    },
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
      }
    },
    additionalInformation: {
      title: 'Additional Information',
      pages: {
      }
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
      }
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
      }
    }
  }
};

export default formConfig;
