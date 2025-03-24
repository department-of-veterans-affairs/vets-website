import React from 'react';

import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';

import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import manifest from '../manifest.json';
import submitForm from './submitForm';
import transform from './transform';
import { getFTECalcs } from '../helpers';

// Components
import GetFormHelp from '../components/GetFormHelp';
import SubmissionInstructions from '../components/SubmissionInstructions';

// Pages
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { SUBMIT_URL } from './constants';
import testData from '../tests/fixtures/data/test-data.json';

import {
  institutionDetails,
  institutionOfficial,
  ProgramIntro,
  programInfo,
  ProgramSummary,
} from '../pages';

export const arrayBuilderOptions = {
  arrayPath: 'programs',
  nounSingular: 'program',
  nounPlural: 'programs',
  required: true,
  text: {
    getItemName: item => item.programName,
    cardDescription: item => {
      const percent = getFTECalcs(item).supportedFTEPercent;
      return percent ? `${percent} supported student FTE` : null;
    },
    summaryTitle: props =>
      location?.pathname.includes('review-and-submit')
        ? ''
        : `Review your ${
            props?.formData?.programs.length > 1 ? 'programs' : 'program'
          }`,
  },
};

const { date } = commonDefinitions;

const submitFormLogic = () => {
  if (environment.isDev() || environment.isLocalhost()) {
    return Promise.resolve(testData);
  }
  return submitForm;
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: submitFormLogic,
  trackingPrefix: 'edu-10215-',
  introduction: IntroductionPage,
  confirmation: ({ router, route }) => (
    <ConfirmationPage router={router} route={route} />
  ),
  formId: '22-10215',
  saveInProgress: {
    messages: {
      inProgress: 'Your form (22-10215) is in progress.',
      expired:
        'Your saved form (22-10215) has expired. Please start a new form.',
      saved: 'Your form has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  preSubmitInfo: {
    statementOfTruth: {
      heading: 'Certification statement',
      body:
        'I hereby certify that the calculations above are true and correct in content and policy.',
      messageAriaDescribedby:
        'I hereby certify that the calculations above are true and correct in content and policy.',
      fullNamePath: 'certifyingOfficial',
    },
  },
  customText: {
    appSavedSuccessfullyMessage: 'We’ve saved your form.',
    appType: 'form',
    continueAppButtonText: 'Continue your form',
    finishAppLaterMessage: 'Finish this form later',
    reviewPageTitle: 'Review',
    startNewAppButtonText: 'Start a new form',
    submitButtonText: 'Continue',
  },
  savedFormMessages: {
    notFound: 'Please start over.',
    noAuth: 'Please sign in again to continue your form.',
  },
  title: 'Report 85/15 Rule enrollment ratios',
  subTitle: () => (
    <p className="vads-u-margin-bottom--0">
      Statement of Assurance of Compliance with 85% Enrollment Ratios (VA Form
      22-10215)
    </p>
  ),
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  defaultDefinitions: {
    date,
  },
  transformForSubmit: transform,
  chapters: {
    institutionDetailsChapter: {
      title: 'Institution details',
      pages: {
        institutionOfficial: {
          path: 'institution-details',
          title: 'Tell us about yourself',
          uiSchema: institutionOfficial.uiSchema,
          schema: institutionOfficial.schema,
          onNavForward: ({ goPath }) => {
            goPath('/institution-details-1');
            localStorage.removeItem('10215ClaimId');
          },
        },
        institutionDetails: {
          path: 'institution-details-1',
          title: 'Institution details',
          uiSchema: institutionDetails.uiSchema,
          schema: institutionDetails.schema,
        },
      },
    },
    programsChapter: {
      title: '85/15 calculations',
      pages: arrayBuilderPages(arrayBuilderOptions, pageBuilder => ({
        programsIntro: pageBuilder.introPage({
          path: '85/15-calculations',
          title: '[noun plural]',
          uiSchema: ProgramIntro.uiSchema,
          schema: ProgramIntro.schema,
        }),
        programsSummary: pageBuilder.summaryPage({
          title: 'Review your [noun plural]',
          path: '85-15-calculations/summary',
          uiSchema: ProgramSummary.uiSchema,
          schema: ProgramSummary.schema,
        }),
        addProgram: pageBuilder.itemPage({
          title: 'Program information',
          path: '85/15-calculations/:index',
          showPagePerItem: true,
          uiSchema: programInfo.uiSchema,
          schema: programInfo.schema,
        }),
      })),
    },
    submissionInstructionsChapter: {
      title: 'Submission instructions',
      hideOnReviewPage: true,
      pages: {
        submissionInstructions: {
          path: 'submission-instructions',
          title: '',
          uiSchema: {
            'ui:description': SubmissionInstructions,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export default formConfig;
