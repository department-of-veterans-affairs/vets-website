// @ts-check
import React from 'react';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '~/platform/utilities/environment';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import * as PreviouslyApplied from '../pages/PreviouslyApplied';
import * as SelectVABenefit from '../pages/SelectVABenefit';
import * as VABenefitWarning from '../pages/VABenefitWarning';

import submitForm from './submitForm';
import transform from './transform';
import prefillTransform from './prefillTransform';

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
    //   inProgress: 'Your education benefits application (22-0803) is in progress.',
    //   expired: 'Your saved education benefits application (22-0803) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer: prefillTransform,
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
  useCustomScrollAndFocus: true,
  chapters: {
    benefitsInformationChapter: {
      title: 'Your education benefits information',
      pages: {
        previouslyApplied: {
          path: 'previously-applied',
          title: 'Previously Applied',
          uiSchema: PreviouslyApplied.uiSchema,
          schema: PreviouslyApplied.schema,
        },
        selectVABenefit: {
          path: 'select-va-benefit-program',
          title: 'VA Benefit Program',
          uiSchema: SelectVABenefit.uiSchema,
          schema: SelectVABenefit.schema,
          depends: formData => formData?.hasPreviouslyApplied,
        },
        vaBenefitWarning: {
          path: 'va-benefit-warning',
          title: 'You VA education benefits',
          uiSchema: VABenefitWarning.uiSchema,
          schema: VABenefitWarning.schema,
          depends: formData => !formData?.hasPreviouslyApplied,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
