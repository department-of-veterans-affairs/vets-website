import { fullName, ssn } from '../../../common/schemaform/definitions';
import { validateSSN } from '../../../common/schemaform/validation';
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
          path: 'veteran-information',
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
              },
              'ui:validations': [
                validateSSN
              ]
            }
          },
          schema: {
            type: 'object',
            title: 'Veteran information',
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
                type: 'number',
                minimum: 1
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
