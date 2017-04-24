import _ from 'lodash/fp';

import fullSchema1990n from 'vets-json-schema/dist/22-1990N-schema.json';

import schoolSelectionPage, { schoolSelectionOptionsFor } from '../../pages/schoolSelection';
import applicantInformationPage from '../../pages/applicantInformation';
import additionalBenefitsPage from '../../pages/additionalBenefits';
import contactInformationPage from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';

import * as toursOfDuty from '../../definitions/toursOfDuty';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform
} from '../helpers';

const {
  payHighestRateBenefit
} = fullSchema1990n.properties;

const {
  currentlyActiveDuty
} = fullSchema1990n.definitions;

const formConfig = {
  urlPrefix: '/1990n/',
  submitUrl: '/v0/education_benefits_claims/1990n',
  trackingPrefix: 'edu-1990n-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
  },
  title: 'Apply for education benefits under the National Call to Service program',
  subTitle: 'Form 22-1990N',
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: applicantInformationPage(fullSchema1990n, {
          fields: [
            'veteranFullName',
            'veteranSocialSecurityNumber',
            'veteranDateOfBirth',
            'gender',
          ],
          required: [
            'veteranFullName',
            'veteranDateOfBirth'
          ],
          isVeteran: true
        }),
        additionalBenefits: additionalBenefitsPage(fullSchema1990n, {
          fields: [
            'civilianBenefitsAssistance',
            'civilianBenefitsSource',
            'seniorRotcScholarshipProgram'
          ]
        }),
        applicantService: {
          title: 'Applicant service',
          path: 'applicant/service',
          initialData: {
          },
          uiSchema: {
            'ui:title': 'Applicant service',
            'view:applicantServed': {
              'ui:title': 'Have you ever served on active duty in the armed services?',
              'ui:widget': 'yesNo'
            },
            toursOfDuty: _.merge(toursOfDuty.uiSchema, {
              'ui:options': {
                expandUnder: 'view:applicantServed'
              },
              'ui:required': form => _.get('view:applicantServed', form)
            }),
            currentlyActiveDuty: {
              'ui:options': {
                expandUnder: 'view:applicantServed'
              },
              yes: {
                'ui:title': 'Are you on active duty now?',
                'ui:widget': 'yesNo',
              },
              onTerminalLeave: {
                'ui:title': 'Are you on terminal leave now?',
                'ui:widget': 'yesNo',
                'ui:options': {
                  expandUnder: 'yes'
                }
              },
              nonVaAssistance: {
                'ui:title': 'Are you getting, or do you expect to get any money from the Armed Forces or public health services for any part of your coursework or training? (Including, but not limited to, Federal Tuition Assistance.)',
                'ui:widget': 'yesNo',
                'ui:options': {
                  expandUnder: 'yes'
                }
              }
            }
          },
          schema: {
            type: 'object',
            // If answered 'Yes' without entering information, it's the same as
            //  answering 'No' as far as the back end is concerned.
            required: ['view:applicantServed'],
            properties: {
              'view:applicantServed': {
                type: 'boolean'
              },
              toursOfDuty: toursOfDuty.schema({
                fields: [
                  'serviceBranch',
                  'dateRange'
                ],
                required: ['serviceBranch', 'dateRange.from']
              }),
              currentlyActiveDuty
            }
          }
        }
      }
    },
    benefitSelection: {
      title: 'Benefit Selection',
      pages: {
        benefitSelection: {
          path: 'benefits/selection', // other forms this is benefits/eligibility
          title: 'Benefit selection',
          uiSchema: {
            payHighestRateBenefit: {
              'ui:title': 'If during the review made by VA I am found eligible for more than one benefit, I authorize VA to pay the benefit with the highest monthly rate.'
            }
          },
          schema: {
            type: 'object',
            properties: {
              payHighestRateBenefit: _.merge(payHighestRateBenefit, {
                'default': true
              })
            }
          }
        }
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        schoolSelection: schoolSelectionPage(fullSchema1990n, schoolSelectionOptionsFor['1990n'])
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation: contactInformationPage(),
        directDeposit
      }
    }
  }
};

export default formConfig;
