import _ from 'lodash/fp';
import { fullName, ssn } from '../../../common/schemaform/definitions';
import { uiFullName, uiSSN, uiDate } from '../../../common/schemaform/uiDefinitions';
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
            'ui:title': 'Veteran information',
            veteranFullName: uiFullName,
            veteranSocialSecurityNumber: uiSSN,
            fileNumber: {
              'ui:title': 'File number'
            },
            someDate: _.merge(uiDate, {
              'ui:title': 'Some date'
            })
          },
          schema: {
            type: 'object',
            definitions: {
              fullName,
              ssn
            },
            required: ['veteranFullName', 'veteranSocialSecurityNumber', 'someDate'],
            properties: {
              veteranFullName: {
                $ref: '#/definitions/fullName'
              },
              veteranSocialSecurityNumber: {
                $ref: '#/definitions/ssn'
              },
              fileNumber: {
                type: 'number',
                minimum: 1
              },
              someDate: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
