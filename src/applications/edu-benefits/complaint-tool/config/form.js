import _ from 'lodash/fp';
import React from 'react';
import fullSchema from 'vets-json-schema/dist/complaint-tool-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import fullNameUI from 'us-forms-system/lib/js/definitions/fullName';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import { transform } from '../helpers';

const {
  onBehalfOf,
  fullName,
  dob,
  serviceAffiliation,
  serviceBranch,
  serviceDateRange,
  email
} = fullSchema.properties;

const {
  date,
  dateRange
} = fullSchema.definitions;

const myself = 'Myself';
const someoneElse = 'Someone else';
const anonymous = 'I want to submit my feedback anonymously';

function isNotAnonymous(formData) {
  if (!!formData && formData !== anonymous) {
    return true;
  }
  return false;
}

function hasNotAnonymous(formData) {
  return !!formData && (formData.onBehalfOf !== anonymous);
}

function hasMyself(formData) {
  return !!formData && (formData.onBehalfOf === myself);
}

function isNotVeteranOrServiceMember(formData) {
  if (!formData.serviceAffiliation || ((formData.serviceAffiliation !== 'Veteran') && (formData.serviceAffiliation !== 'Service Member'))) {
    return true;
  }
  return false;
}

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
    date,
    dateRange
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Applicant Information',
          uiSchema: {
            onBehalfOf: {
              'ui:widget': 'radio',
              'ui:title': 'I’m submitting feedback on behalf of...',
              'ui:options': {
                nestedContent: {
                  [myself]: () => <div className="usa-alert-info no-background-image"><i>(We’ll only share your name with the school.)</i></div>,
                  [someoneElse]: () => <div className="usa-alert-info no-background-image"><i>(We’ll only share your name with the school.)</i></div>,
                  [anonymous]: () => <div className="usa-alert-info no-background-image"><i>(Your personal information won’t be shared with anyone outside of VA.)</i></div>
                },
                expandUnderClassNames: 'schemaform-expandUnder',
              }
            },
            fullName: _.merge(fullNameUI, {
              prefix: {
                'ui:title': 'Prefix',
                'ui:options': {
                  widgetClassNames: 'form-select-medium'
                }
              },
              first: {
                'ui:title': 'Your first name',
                'ui:required': hasNotAnonymous
              },
              last: {
                'ui:title': 'Your last name',
                'ui:required': hasNotAnonymous
              },
              middle: {
                'ui:title': 'Your middle name'
              },
              suffix: {
                'ui:title': 'Your suffix'
              },
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: isNotAnonymous
              }
            }),
            dob: {
              'ui:title': 'Date of birth',
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: isNotAnonymous
              }
            },
            serviceAffiliation: { // could wrap service info in an object
              'ui:title': 'Service affiliation',
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: myself
              },
              'ui:required': hasMyself,
            },
            serviceBranch: {
              'ui:title': 'Branch of service',
              'ui:options': {
                hideIf: isNotVeteranOrServiceMember,
                expandUnder: 'onBehalfOf',
                expandUnderCondition: myself
              }
            },
            serviceDateRange: _.merge(dateRangeUI(
              'Service start date',
              'Service end date',
              'End of service must be after start of service'
            ),
            {
              'ui:options': {
                hideIf: isNotVeteranOrServiceMember,
                expandUnder: 'onBehalfOf',
                expandUnderCondition: myself
              }
            }),
            email: {
              'ui:title': 'Email',
              'ui:options': {
                expandUnder: 'onBehalfOf',
                expandUnderCondition: anonymous
              }
            }
          },
          schema: {
            type: 'object',
            required: [
              'onBehalfOf',
            ],
            properties: {
              onBehalfOf,
              fullName,
              dob,
              serviceAffiliation,
              serviceBranch,
              serviceDateRange,
              email
            }
          }
        }
      }
    }
  }
};

export default formConfig;
