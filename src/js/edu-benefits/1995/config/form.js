import { fullName, ssn } from '../../../common/schemaform/definitions';
import IntroductionPage from '../components/IntroductionPage';

const formConfig = {
  urlPrefix: '/1995/',
  introduction: IntroductionPage,
  confirmation: null,
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'applicant-information',
          initialData: {},
          errorMessages: {
            veteranSocialSecurityNumber: {
              pattern: 'Please enter a valid nine digit SSN (dashes allowed)'
            }
          },
          uiSchema: {
            veteranFullName: {
              suffix: {
                'ui:options': {
                  widgetClassNames: 'form-select-medium'
                }
              }
            },
            veteranSocialSecurityNumber: {
              'ui:options': {
                widgetClassNames: 'usa-input-medium'
              }
            }
          },
          schema: {
            type: 'object',
            title: 'Applicant information',
            definitions: {
              fullName,
              ssn
            },
            required: ['veteranFullName', 'veteranSocialSecurityNumber'],
            properties: {
              veteranFullName: {
                $ref: '#/definitions/fullName'
              },
              veteranSocialSecurityNumber: {
                $ref: '#/definitions/ssn'
              },
              fileNumber: {
                title: 'File number',
                type: 'number'
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
