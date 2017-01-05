import { fullName, ssn } from '../../../common/forms/definitions';
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
            },
            veteranDateOfBirth: {
              pattern: 'Please provide a valid date'
            }
          },
          uiSchema: {
            veteranSocialSecurityNumber: {
              'ui:options': {
                widgetClassNames: 'usa-input-medium'
              }
            },
            veteranDateOfBirth: {
              'ui:field': 'mydate'
            },
            gender: {
              'ui:widget': 'radio'
            }
          },
          schema: {
            type: 'object',
            title: 'Personal information',
            definitions: {
              fullName,
              ssn
            },
            required: ['veteranFullName', 'veteranSocialSecurityNumber', 'veteranDateOfBirth'],
            properties: {
              veteranFullName: {
                $ref: '#/definitions/fullName'
              },
              veteranSocialSecurityNumber: {
                $ref: '#/definitions/ssn'
              },
              veteranDateOfBirth: {
                title: 'Date of birth',
                type: 'string',
                pattern: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$'
              },
              gender: {
                title: 'Gender',
                type: 'string',
                'enum': ['F', 'M'],
                enumNames: ['Female', 'Male']
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
