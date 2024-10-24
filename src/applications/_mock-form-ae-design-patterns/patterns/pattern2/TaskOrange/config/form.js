import React from 'react';
import merge from 'lodash/merge';
import unset from 'platform/utilities/data/unset';

import fullSchema1990 from 'vets-json-schema/dist/22-1990-schema.json';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import yearUI from 'platform/forms-system/src/js/definitions/year';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { omit } from 'lodash';
import { scrollAndFocusTarget } from 'applications/_mock-form-ae-design-patterns/utils/focus';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  descriptionUI,
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { PrefillAlert } from 'applications/_mock-form-ae-design-patterns/shared/components/alerts/PrefillAlert';
import PreSubmitInfo from '../pages/PreSubmitInfo';
import contactInformationPage from '../pages/contactInformation';
import GetFormHelp from '../components/GetFormHelp';
import ErrorText from '../components/ErrorText';
import GuardianInformation from '../pages/GuardianInformation';

import manifest from '../manifest.json';

import seniorRotcUI from '../definitions/seniorRotc';
import createDirectDepositPage1990 from '../pages/DirectDeposit';

import * as toursOfDuty from '../definitions/toursOfDuty';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { benefitsEligibilityUpdate } from '../pages/benefitsEligibilityUpdate';

import {
  transform,
  benefitsEligibilityBox,
  prefillTransformer,
} from '../helpers';

import { urlMigration } from './migrations';
import {
  ApplicantInformation,
  ApplicantInformationInfoSection,
} from '../pages/ApplicantInformation';
import ReviewPage from '../pages/ReviewPage';
import { EditNavigationWithRouter } from '../components/EditNavigation';
import { ServicePeriodReview } from '../pages/ServicePeriodReview';

const {
  chapter33,
  chapter30,
  chapter1606,
  seniorRotcScholarshipProgram,
  seniorRotc,
  additionalContributions,
  activeDutyKicker,
  reserveKicker,
  serviceAcademyGraduationYear,
} = fullSchema1990.properties;

const {
  date,
  fullName,
  ssn,
  gender,
  dateRange,
  year,
  currentlyActiveDuty,
  address,
  usaPhone,
} = fullSchema1990.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/2/task-orange/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1990`,
  trackingPrefix: 'edu-',
  formId: VA_FORM_IDS.FORM_22_1990,
  saveInProgress: {
    messages: {
      inProgress:
        'Your education benefits application (22-1990) is in progress.',
      expired:
        'Your saved education benefits application (22-1990) has expired. If you want to apply for education benefits, please start a new application.',
      saved: 'Your education benefits application has been saved.',
    },
  },
  version: 1,
  migrations: [urlMigration('/1990')],
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  prefillEnabled: true,
  prefillTransformer,
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    date,
    dateRange,
    fullName,
    gender,
    ssn,
    year,
    address,
    usaPhone,
  },
  title: 'Apply for education benefits',
  subTitle: 'Form 22-1990',
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Applicant information',
          CustomPage: ApplicantInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: {
            type: 'string',
            properties: {},
          },
          review: props => ({
            'Applicant Information': (() => {
              const {
                veteranFullName,
                veteranSocialSecurityNumber,
                veteranDateOfBirth,
                gender: genderData,
              } = props?.data;

              return (
                <ApplicantInformationInfoSection
                  veteranDateOfBirth={veteranDateOfBirth}
                  veteranFullName={veteranFullName}
                  veteranSocialSecurityNumber={veteranSocialSecurityNumber}
                  gender={genderData}
                />
              );
            })(),
          }),
        },
      },
    },
    benefitsEligibility: {
      title: 'Benefits eligibility',
      pages: {
        benefitsEligibility: {
          title: 'Benefits eligibility',
          path: 'benefits-eligibility/benefits-selection',
          uiSchema: benefitsEligibilityUpdate(
            benefitsEligibilityBox,
            validateBooleanGroup,
          ).uiSchema,
          schema: benefitsEligibilityUpdate(
            '',
            null,
            chapter33,
            chapter30,
            chapter1606,
          ).schema,
        },
      },
    },
    militaryHistory: {
      title: 'Service history',
      pages: {
        servicePeriods: {
          title: 'Service periods',
          path: 'military-history/service-periods',
          uiSchema: {
            // 'ui:title': 'Service periods',
            toursOfDuty: merge({}, toursOfDuty.uiSchema, {
              'ui:title': null,
              'ui:description': 'Please record all your periods of service.',
              'ui:options': {
                keepInPageOnReview: true,
              },
            }),
          },
          schema: {
            type: 'object',
            properties: {
              toursOfDuty: toursOfDuty.schema(fullSchema1990, {
                required: ['serviceBranch', 'dateRange.from'],
                fields: [
                  'serviceBranch',
                  'serviceStatus',
                  'dateRange',
                  'applyPeriodToSelected',
                  'benefitsToApplyTo',
                  'view:disclaimer',
                ],
              }),
            },
          },
          review: props => ({
            'Service Period': (() => {
              return <ServicePeriodReview {...props} />;
            })(),
          }),
        },
        militaryService: {
          title: 'Military service',
          path: 'military-history/military-service',
          uiSchema: {
            serviceAcademyGraduationYear: {
              ...yearUI,
              'ui:title':
                'If you received a commission from a military service academy, what year did you graduate?',
            },
            currentlyActiveDuty: {
              yes: {
                'ui:title': 'Are you on active duty now?',
                'ui:widget': 'yesNo',
              },
              onTerminalLeave: {
                'ui:title': 'Are you on terminal leave now?',
                'ui:widget': 'yesNo',
                'ui:options': {
                  expandUnder: 'yes',
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              serviceAcademyGraduationYear,
              currentlyActiveDuty: {
                type: 'object',
                properties: {
                  yes: currentlyActiveDuty.properties.yes,
                  onTerminalLeave:
                    currentlyActiveDuty.properties.onTerminalLeave,
                },
              },
            },
          },
        },
        rotcHistory: {
          title: 'ROTC history',
          path: 'military-history/rotc-history',
          uiSchema: {
            'ui:title': 'ROTC history',
            seniorRotcScholarshipProgram: {
              'ui:title':
                'Are you in a senior ROTC scholarship program right now that pays your tuition, fees, books, and supplies? (Covered under Section 2107 of Title 10, U.S. Code)',
              'ui:widget': 'yesNo',
            },
            'view:seniorRotc': {
              'ui:title': 'Were you commissioned as a result of senior ROTC?',
              'ui:widget': 'yesNo',
            },
            seniorRotc: {
              commissionYear: merge({}, yearUI, {
                'ui:title': 'Year of commission:',
              }),
              rotcScholarshipAmounts: seniorRotcUI,
              'ui:options': {
                expandUnder: 'view:seniorRotc',
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              seniorRotcScholarshipProgram,
              'view:seniorRotc': {
                type: 'boolean',
              },
              seniorRotc: unset('required', seniorRotc),
            },
          },
        },
        contributions: {
          title: 'Contributions',
          path: 'military-history/contributions',
          uiSchema: {
            'ui:title': 'Contributions',
            'ui:description': 'Select all that apply:',
            additionalContributions: {
              'ui:title':
                'I made contributions (up to $600) to increase the amount of my monthly benefits.',
            },
            activeDutyKicker: {
              'ui:title':
                'I qualify for an Active Duty Kicker (sometimes called a college fund).',
            },
            reserveKicker: {
              'ui:title':
                'I qualify for a Reserve Kicker (sometimes called a college fund).',
            },
            'view:activeDutyRepayingPeriod': {
              'ui:title':
                'I have a period of service that the Department of Defense counts toward an education loan payment.',
              'ui:options': {
                expandUnderClassNames: 'schemaform-expandUnder-indent',
              },
            },
            activeDutyRepayingPeriod: merge(
              {},
              {
                'ui:options': {
                  expandUnder: 'view:activeDutyRepayingPeriod',
                },
                to: {
                  'ui:required': formData =>
                    formData['view:activeDutyRepayingPeriod'],
                },
                from: {
                  'ui:required': formData =>
                    formData['view:activeDutyRepayingPeriod'],
                },
              },
              dateRangeUI('Start date', 'End date'),
            ),
          },
          schema: {
            type: 'object',
            properties: {
              additionalContributions,
              activeDutyKicker,
              reserveKicker,
              'view:activeDutyRepayingPeriod': {
                type: 'boolean',
              },
              activeDutyRepayingPeriod: dateRange,
            },
          },
        },
      },
    },
    personalInformation: {
      title: 'Personal information',
      pages: {
        otherContactInfo: {
          hideNavButtons: true,
          title: 'Edit other contact information',
          taskListHide: true,
          path: 'personal-information/edit-other-contact-information',
          uiSchema: {
            ...descriptionUI(PrefillAlert, { hideOnReview: true }),
            'view:pageTitle': titleUI({
              title: 'Edit other contact information',
              classNames: 'vads-u-margin-bottom--0',
            }),

            email: emailUI('Email address'),
            'view:confirmEmail': {
              ...emailUI(),
              'ui:title': 'Confirm email address',
              'ui:required': () => true,
              'ui:validations': [
                {
                  validator: (errors, fieldData, formData) => {
                    if (
                      formData.email.toLowerCase() !==
                      formData['view:confirmEmail'].toLowerCase()
                    ) {
                      errors.addError(
                        'This email does not match your previously entered email',
                      );
                    }
                  },
                },
              ],
            },
            homePhone: phoneUI('Home phone number'),
            mobilePhone: phoneUI('Mobile phone number'),
            'view:editNavigation': {
              'ui:options': {
                hideOnReview: true, // We're using the `ReveiwDescription`, so don't show this page
                forceDivWrapper: true, // It's all info and links, so we don't need a fieldset or legend
              },
              'ui:reviewId': 'other-contact-information',
              'ui:title': '',
              'ui:description': '',
              'ui:widget': props => {
                return (
                  <EditNavigationWithRouter
                    {...props}
                    fields={['email', 'homePhone', 'mobilePhone']}
                    returnPath="/personal-information"
                  />
                );
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:pageTitle': blankSchema,
              email: emailSchema,
              'view:confirmEmail': {
                type: 'string',
              },
              homePhone: phoneSchema,
              mobilePhone: phoneSchema,
              'view:editNavigation': {
                type: 'string',
              },
            },
            required: ['email'],
          },
          scrollAndFocusTarget,
          depends: () => false,
          review: null,
        },
        contactInformation: merge({}, contactInformationPage(fullSchema1990), {
          uiSchema: {
            'ui:title': 'Contact information',
          },
        }),
        directDeposit: createDirectDepositPage1990(),
      },
    },
    GuardianInformation: {
      title: 'Guardian information',
      pages: {
        guardianInformation: GuardianInformation(fullSchema1990, {}),
      },
    },
    reviewApp: {
      title: 'Review Application',
      pages: {
        reviewAndSubmit: {
          hideNavButtons: true,
          title: 'Review and submit',
          path: 'review-then-submit',
          CustomPage: ReviewPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: {
            definitions: {},
            type: 'object',
            properties: {},
          },
          scrollAndFocusTarget,
        },
      },
    },
  },
};

// trying something different here and omitting the pages that we don't want to show
// in the orange task instead of manipulating the orig formConfig object
export const formConfigForOrangeTask = omit(formConfig, [
  'chapters.benefitsEligibility',
  'chapters.personalInformation.pages.directDeposit',
  'chapters.militaryHistory.pages.militaryService',
  'chapters.militaryHistory.pages.rotcHistory',
  'chapters.militaryHistory.pages.contributions',
  'chapters.GuardianInformation',
]);

// export const formConfigForOrangeTask = formConfig;

export default formConfig;
