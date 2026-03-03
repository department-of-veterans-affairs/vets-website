import React from 'react';

import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';

import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import manifest from '../manifest.json';
import submitForm from './submitForm';
import transform from './transform';
import { daysAgoYyyyMmDd, getFTECalcs } from '../helpers';

// Components
import GetFormHelp from '../components/GetFormHelp';
import PrivacyPolicy from '../components/PrivacyPolicy';
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

export const convertPercentageToText = percent => {
  return percent ? `${percent} supported student FTE` : null;
};

export const arrayBuilderOptions = {
  arrayPath: 'programs',
  nounSingular: 'program',
  nounPlural: 'programs',
  required: true,
  maxItems: 999999,
  text: {
    getItemName: item => item.programName,
    cardDescription: item => {
      const percent = getFTECalcs(item).supportedFTEPercent;

      return parseInt(item?.supportedStudents, 10) < 10
        ? 'Fewer than 10 supported students'
        : convertPercentageToText(percent);
    },
    summaryTitle: props =>
      `Review your ${
        props?.formData?.programs.length > 1 ? 'programs' : 'program'
      }`,
  },
};

const { date } = commonDefinitions;

export const submitFormLogic = (form, formConfig) => {
  if (environment.isDev() || environment.isLocalhost()) {
    const testDataShallowCopy = { ...testData };
    testDataShallowCopy.data.institutionDetails.termStartDate = daysAgoYyyyMmDd(
      14,
    );
    testDataShallowCopy.data.institutionDetails.dateOfCalculations = daysAgoYyyyMmDd(
      10,
    );
    return Promise.resolve(testDataShallowCopy);
  }
  return submitForm(form, formConfig);
};

export const confirmFormLogic = ({ router, route }) => (
  <ConfirmationPage router={router} route={route} />
);

export const onNavForwardLogic = ({ goPath }) => {
  goPath('/identifying-details-1');
  localStorage.removeItem('10215ClaimId');
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: submitFormLogic,
  trackingPrefix: 'edu-10215-',
  introduction: IntroductionPage,
  confirmation: confirmFormLogic,
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
      body: PrivacyPolicy,
      messageAriaDescribedby: 'I have read and accept the privacy policy.',
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
  title: 'Report 85/15 rule enrollment ratios',
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
  useCustomScrollAndFocus: true,
  chapters: {
    institutionDetailsChapter: {
      title: 'Identifying details',
      pages: {
        institutionOfficial: {
          path: 'identifying-details',
          title: 'Your name and title',
          uiSchema: institutionOfficial.uiSchema,
          schema: institutionOfficial.schema,
          onNavForward: onNavForwardLogic,
        },
        institutionDetails: {
          path: 'identifying-details-1',
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
