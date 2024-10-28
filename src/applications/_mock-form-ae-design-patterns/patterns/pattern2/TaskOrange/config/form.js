import React from 'react';
import merge from 'lodash/merge';

import fullSchema1990 from 'vets-json-schema/dist/22-1990-schema.json';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
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
import * as addressFormDefinition from 'platform/forms-system/src/js/definitions/address';
import { PrefillAlert } from 'applications/_mock-form-ae-design-patterns/shared/components/alerts/PrefillAlert';
import PreSubmitInfo from '../pages/PreSubmitInfo';
import contactInformationPage from '../pages/contactInformation';
import GetFormHelp from '../components/GetFormHelp';
import ErrorText from '../components/ErrorText';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { transform, prefillTransformer } from '../helpers';

import { urlMigration } from './migrations';
import {
  ApplicantInformation,
  ApplicantInformationInfoSection,
} from '../pages/ApplicantInformation';
import ReviewPage from '../pages/ReviewPage';
import { EditNavigationWithRouter } from '../components/EditNavigation';
import { ContactInfoEditReroute } from '../pages/ContactInfoEditReroute';

const {
  date,
  fullName,
  ssn,
  gender,
  dateRange,
  year,
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
  dev: {
    showNavLinks: true,
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
        contactInformation: merge({}, contactInformationPage(fullSchema1990)),
        contactInformationEdit: {
          title: 'Edit contact information',
          taskListHide: true,
          path: 'personal-information/edit-veteran-address',
          CustomPage: ContactInfoEditReroute,
          CustomPageReview: null,
          uiSchema: {
            ...descriptionUI(PrefillAlert, { hideOnReview: true }),
            veteranAddress: addressFormDefinition.uiSchema(
              'Edit mailing address',
            ),
          },
          schema: {
            type: 'object',
            properties: {
              'view:pageTitle': blankSchema,
              veteranAddress: addressFormDefinition.schema(
                fullSchema1990,
                true,
              ),
            },
          },
          depends: () => false,
        },
      },
    },
    review: {
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

export const formConfigForOrangeTask = formConfig;

export default formConfig;
