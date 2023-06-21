import React from 'react';
import footerContent from 'platform/forms/components/FormFooter';

import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from '../../shared/config/submit-transformer';

const statementOfTruthBody = (
  <>
    <p>
      I understand that I may be asked to confirm the truthfulness of the
      answers to the best of my knowledge under penalty of perjury.
    </p>

    <p>
      I also understand that VA may request further documentation or evidence to
      verify or confirm my authorization to sign or complete an application on
      behalf of the veteran/claimant if necessary. Examples of evidence which VA
      may request include:
    </p>

    <ul>
      <li>
        Social Security Number (SSN) or Taxpayer Identification Number (TIN);
      </li>
      <li>
        a certificate or order from a court with competent jurisdiction showing
        my authority to act for the veteran/claimant with a judge’s signature
        and date/time stamp;
      </li>
      <li>copy of documentation showing appointment of fiduciary;</li>
      <li>
        durable power of attorney showing the name and signature of the
        veteran/claimant and my authority as attorney in fact or agent;
      </li>
      <li>
        health care power of attorney, affidavit or notarized statement from an
        institution or person responsible for the care of the veteran/claimant
        indicating the capacity or responsibility of care provided;
      </li>
      <li>or any other documentation showing such authorization.</li>
    </ul>
    <p>
      I certify that the identifying information in this form has been correctly
      represented.
    </p>
  </>
);

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  transformForSubmit,
  trackingPrefix: '21-0972-alternate-signer-',
  dev: {
    showNavLinks: true,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: {
    statementOfTruth: {
      body: statementOfTruthBody,
      // TODO: figure out what to put in the label
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'preparerName',
    },
  },
  formId: '21-0972',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your alternate signer application (21-0972) is in progress.',
    //   expired: 'Your saved alternate signer application (21-0972) has expired. If you want to apply for alternate signer, please start a new application.',
    //   saved: 'Your alternate signer application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for alternate signer.',
    noAuth:
      'Please sign in again to continue your application for alternate signer.',
  },
  title: 'Sign for benefits on behalf of another person',
  subTitle: 'Alternate signer certification (VA Form 21-0972)',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
