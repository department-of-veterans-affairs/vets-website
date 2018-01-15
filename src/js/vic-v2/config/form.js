// import _ from 'lodash/fp';

// import { transform } from '../helpers';
// import fullSchemaVIC from 'vets-json-schema/dist/VIC-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PhotoField from '../components/PhotoField';

// const { } = fullSchemaVIC.properties;
//
// const { } = fullSchemaVIC.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/vic',
  trackingPrefix: 'veteran-id-card-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'VIC',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for a veteran id card.',
    noAuth: 'Please sign in again to resume your application for a veteran id card.'
  },
  title: 'Apply for veteran id card',
  defaultDefinitions: {},
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
      }
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
      }
    },
    documentUpload: {
      title: 'Document Upload',
      pages: {
        photoUpload: {
          path: 'documents/photo',
          title: 'Photo upload',
          uiSchema: {
            photo: {
              'ui:field': PhotoField
            }
          },
          schema: {
            type: 'object',
            properties: {
              photo: {
                type: 'any'
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
