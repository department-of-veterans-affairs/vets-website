// @ts-check
import React from 'react';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';
import environment from '~/platform/utilities/environment';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import previouslyApplied from '../pages/previouslyApplied';
import vaBenefitProgram from '../pages/vaBenefitProgram';
import payeeNumber from '../pages/payeeNumber';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmail from '../pages/phoneAndEmail';
import testNameAndDate from '../pages/testNameAndDate';
import organizationInfo from '../pages/organizationInfo';
import testCost from '../pages/testCost';
import remarksPage from '../pages/remarksPage';
import submissionInstructions from '../pages/submissionInstructions';

import submitForm from './submitForm';
import transform from './tranform';

export const SUBMIT_URL = `${
  environment.API_URL
}/v0/education_benefits_claims/0803`;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: submitForm,
  trackingPrefix: '0803-edu-benefits-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: VA_FORM_IDS.FORM_22_0803,
  saveInProgress: {
    // messages: {
    //   inProgress:
    //     'Your education benefits application (22-0803) is in progress.',
    //   expired:
    //     'Your saved education benefits application (22-0803) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  transformForSubmit: transform,
  preSubmitInfo: {
    statementOfTruth: {
      heading: 'Certification statement',
      body: (
        <div>
          <p>
            I hereby authorize the release of my test information to the
            Department of Veterans Affairs (VA).
          </p>
          <p>
            <strong>Penalty:</strong> Willfully false statements as to a
            material fact in a claim for education benefits payable by VA may
            result in a fine, imprisonment, or both.
          </p>
        </div>
      ),
      useProfileFullName: true,
      messageAriaDescribedby: 'I have read and accept the privacy policy.',
    },
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    benefitsInformationChapter: {
      title: 'Your education benefits information',
      pages: {
        hasPreviouslyApplied: {
          path: 'previously-applied',
          title: 'Previously Applied',
          uiSchema: previouslyApplied.uiSchema,
          schema: previouslyApplied.schema,
        },
        vaBenefitProgram: {
          path: 'va-benefit-program',
          title: 'VA Benefit Program',
          uiSchema: vaBenefitProgram.uiSchema,
          schema: vaBenefitProgram.schema,
        },
      },
    },
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        ...personalInformationPage({
          personalInfoConfig: {
            name: { show: true, required: false },
            ssn: { show: true, required: false },
            dateOfBirth: { show: true, required: false },
          },
          dataAdapter: {
            ssnPath: 'application.claimant.ssn',
          },
        }),
        payeeNumber: {
          path: 'payee-number',
          title: 'Payee Number',
          uiSchema: payeeNumber.uiSchema,
          schema: payeeNumber.schema,
        },
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing Address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        phoneAndEmail: {
          path: 'phone-and-email',
          title: 'Phone and Email',
          uiSchema: phoneAndEmail.uiSchema,
          schema: phoneAndEmail.schema,
        },
      },
    },
    testInformationChapter: {
      title: 'Test information',
      pages: {
        testNameAndDate: {
          path: 'test-name-and-date',
          title: 'Test name and date',
          uiSchema: testNameAndDate.uiSchema,
          schema: testNameAndDate.schema,
        },
        organizationInfo: {
          path: 'organization-info',
          title: 'Organization information',
          uiSchema: organizationInfo.uiSchema,
          schema: organizationInfo.schema,
        },
        testCost: {
          path: 'test-cost',
          title: 'Test cost',
          uiSchema: testCost.uiSchema,
          schema: testCost.schema,
        },
      },
    },
    remarksChapter: {
      title: 'Remarks',
      pages: {
        remarksPage: {
          path: 'remarks',
          title: 'Remarks',
          uiSchema: remarksPage.uiSchema,
          schema: remarksPage.schema,
        },
      },
    },
    submissionInstructionsChapter: {
      title: 'Submission instructions',
      'ui:options': {
        hideOnReview: true,
      },
      pages: {
        submissionInstructions: {
          path: 'submission-instructions',
          title: 'Submission instructions',
          uiSchema: submissionInstructions.uiSchema,
          schema: submissionInstructions.schema,
          'ui:options': {
            hideOnReview: true,
          },
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
