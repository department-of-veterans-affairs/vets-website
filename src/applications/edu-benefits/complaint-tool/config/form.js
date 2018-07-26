import fullSchema from 'vets-json-schema/dist/complaint-tool-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SchoolSelectField from '../../components/SchoolSelectField.jsx';
import {
  fetchInstitutions,
  transformInstitutionsForSchoolSelectField
} from '../helpers';

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
} = school;

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
  title: 'Opt Out of Sharing VA Education Benefits Information',
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
                  schoolSelect: {
                    fetchInstitutions: ({ institutionQuery, page }) => fetchInstitutions({ institutionQuery, page })
                      .then(({ error, payload }) => transformInstitutionsForSchoolSelectField({ error, institutionQuery, payload }))
                  }
                }
              },
              'view:manualSchoolEntry': {
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
                    type: 'boolean'
                  },
                  'view:manualSchoolEntry': {
                    type: 'object',
                    properties: {
                      schoolName,
                      schoolAddress,
                      schoolAddress2,
                      schoolCity,
                      schoolState,
                      schoolCountry,
                      schoolPostalCode
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
