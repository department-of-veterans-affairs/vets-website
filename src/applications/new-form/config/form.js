// import fullSchema from 'vets-json-schema/dist/2021-90210-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formFields = {
  firstName: 'firstName',
};

// const formConfig = {
//   rootUrl: manifest.rootUrl,
//   urlPrefix: '/',
//   submitUrl: '/v0/api',
//   trackingPrefix: 'new-form-',
//   introduction: IntroductionPage,
//   confirmation: ConfirmationPage,
//   formId: '2021-90210',
//   saveInProgress: {
//     // messages: {
//     //   inProgress: 'Your benefits application (2021-90210) is in progress.',
//     //   expired: 'Your saved benefits application (2021-90210) has expired. If you want to apply for benefits, please start a new application.',
//     //   saved: 'Your benefits application has been saved.',
//     // },
//   },
//   version: 0,
//   prefillEnabled: true,
//   savedFormMessages: {
//     notFound: 'Please start over to apply for benefits.',
//     noAuth: 'Please sign in again to continue your application for benefits.',
//   },
//   title: 'A New Form',
//   defaultDefinitions: {},
//   chapters: {
//     chapter1: {
//       title: 'Personal Information',
//       pages: {
//         page1: {
//           path: 'first-name',
//           title: 'Personal Information - Page 1',
//           uiSchema: {
//             [formFields.firstName]: {
//               'ui:title': 'First Name',
//             },
//           },
//           schema: {
//             required: [formFields.firstName],
//             type: 'object',
//             properties: {
//               [formFields.firstName]: {
//                 type: 'string',
//               },
//             },
//           },
//         },
//       },
//     },
//   },
// };

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'new-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'XX-230',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for new form benefits.',
    noAuth: 'Please sign in again to continue your application for new form benefits.'
  },
  title: 'My new form',
  defaultDefinitions: {
  },
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: {
            myField: {
              'ui:title': 'My field label'
            }
          },
          schema: {
            type: 'object',
            properties: {
              myField: {
                type: 'string',
                'enum': [
                  'First option',
                  'Second option'
                ],
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
