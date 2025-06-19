// import { externalServices } from 'platform/monitoring/DowntimeNotification';
// import React from 'react';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import prefillTransformer from '../prefill-transformer';

// Chapter imports
import { veteranInformation } from './chapters/veteran-information/veteranInformation';
// import { veteranContactInformation } from './chapters/veteran-contact-information/veteranContactInformation';
import editAddressPage from './chapters/veteran-contact-information/editAddressPage';
import editPhonePage from './chapters/veteran-contact-information/editPhonePage';
import editInternationalPhonePage from './chapters/veteran-contact-information/editInternationalPhonePage';
import editEmailPage from './chapters/veteran-contact-information/editEmailPage';

import VeteranContactInformationPage from '../components/VeteranContactInformationPage';
import VeteranContactInformationReviewPage from '../components/VeteranContactInformationReviewPage.jsx';
import NeedHelp from '../components/NeedHelp';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '0538-dependents-verification-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      useProfileFullName: true,
    },
  },
  downtime: {
    requiredForPrefill: true,
    dependencies: [
      // externalServices.bgs,
      // externalServices.global,
      // externalServices.mvi,
      // externalServices.vaProfile,
      // externalServices.vbms,
    ],
  },
  prefillEnabled: true,
  prefillTransformer,
  verifyRequiredPrefill: true,
  formId: VA_FORM_IDS.FORM_21_0538,
  saveInProgress: {
    messages: {
      inProgress:
        'Your dependent-benefits application (21-0538) is in progress.',
      expired:
        'Your saved dependent-benefits application (21-0538) has expired. If you want to apply for dependent-benefits, please start a new application.',
      saved: 'Your dependent-benefits application has been saved.',
    },
  },
  version: 0,
  savedFormMessages: {
    notFound: 'Please start over to apply for dependent-benefits.',
    noAuth:
      'Please sign in again to continue your application for dependent-benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    veteranInformation: {
      title: 'Review your personal information',
      // This is the same review page title as within the accordion... will
      // consult with design on content changes
      reviewTitle: 'Your personal information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Your personal information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
      },
    },
    veteranContactInformation: {
      title: "Veteran's contact information",
      pages: {
        veteranContactInformation: {
          path: 'veteran-contact-information',
          title: 'Veteran contact information',
          initialData: {},
          CustomPage: VeteranContactInformationPage,
          CustomPageReview: VeteranContactInformationReviewPage,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        editAddressPage,
        editEmailPage,
        editPhonePage,
        editInternationalPhonePage,
      },
    },
  },
  getHelp: NeedHelp,
  footerContent,
};

export default formConfig;
