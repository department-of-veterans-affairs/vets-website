import fullSchema from 'vets-json-schema/dist/complaint-tool-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SchoolSelectField from '../../components/SchoolSelectField.jsx';

const { educationDetails } = fullSchema.properties;

const { school } = educationDetails;

const {
  name: schoolName,
  address: schoolAddress,
  address2: schoolAddress2,
  city: schoolCity,
  state: schoolState,
  country: schoolCountry,
  postalCode: schoolPostalCode
} = school.properties;

import { transform } from '../helpers';

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'complaint-tool',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '686',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for declaration of status of dependents.',
    noAuth: 'Please sign in again to continue your application for declaration of status of dependents.'
  },
  title: 'GI Bill® School Feedback Tool',
  transformForSubmit: transform,
  defaultDefinitions: {
  },
  chapters: {
    schoolInformation: {
      title: 'School Information',
      pages: {
        schoolInformation: {
          path: 'school-information',
          title: 'School Information',
          uiSchema: {
            school: {
              name: {
                'ui:field': SchoolSelectField,
                'ui:options': {
                  hideIf: formData => formData.school['view:cannotFindSchool']
                }
              },
              'view:manualSchoolEntry': {
                name: {
                  'ui:title': 'Name'
                },
                address: {
                  'ui:title': 'Address line 1'
                },
                address2: {
                  'ui:title': 'Address line 2'
                },
                city: {
                  'ui:title': 'City'
                },
                state: {
                  'ui:title': 'State'
                },
                country: {
                  'ui:title': 'Country'
                },
                postalCode: {
                  'ui:title': 'Postal Code'
                },
                'ui:options': {
                  expandUnder: 'view:cannotFindSchool'
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              school: {
                type: 'object',
                properties: {
                  name: { // TODO: determine whether to store facility ID
                    type: 'string'
                  },
                  'view:cannotFindSchool': {
                    title: 'I can’t find my school',
                    type: 'boolean'
                  },
                  'view:manualSchoolEntry': {
                    type: 'object',
                    properties: {
                      name: schoolName,
                      address: schoolAddress,
                      address2: schoolAddress2,
                      city: schoolCity,
                      state: schoolState,
                      country: schoolCountry,
                      postalCode: schoolPostalCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
