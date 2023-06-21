import React from 'react';
import footerContent from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';

import {
  claimantAddressTitle,
  claimantContactInformationTitle,
  claimantPersonalInformationTitle,
  claimantSsnTitle,
} from './helpers';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from '../../shared/config/submit-transformer';

import preparerPersonalInformation from '../pages/preparerPersonalInformation';
import preparerAddress from '../pages/preparerAddress';
import preparerContactInformation from '../pages/preparerContactInformation';
import claimantIdentification from '../pages/claimantIdentification';
import claimantPersonalInformation from '../pages/claimantPersonalInformation';
import claimantSsn from '../pages/claimantSsn';
import claimantAddress from '../pages/claimantAddress';
import claimantContactInformation from '../pages/claimantContactInformation';
import preparerQualifications from '../pages/preparerQualifications';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/minimal-test.json';

const mockData = testData;

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
        A certificate or order from a court with competent jurisdiction showing
        my authority to act for the veteran/claimant with a judge’s signature
        and date/time stamp;
      </li>
      <li>Copy of documentation showing appointment of fiduciary;</li>
      <li>
        Durable power of attorney showing the name and signature of the
        veteran/claimant and my authority as attorney in fact or agent;
      </li>
      <li>
        Health care power of attorney, affidavit or notarized statement from an
        institution or person responsible for the care of the veteran/claimant
        indicating the capacity or responsibility of care provided;
      </li>
      <li>Or any other documentation showing such authorization.</li>
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
    preparerPersonalInformationChapter: {
      title: 'Your personal information',
      pages: {
        preparerPersonalInformation: {
          path: 'preparer-personal-information',
          title: 'Your personal information',
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData:
            !!mockData && environment.isLocalhost() ? mockData : undefined,
          uiSchema: preparerPersonalInformation.uiSchema,
          schema: preparerPersonalInformation.schema,
        },
      },
    },
    preparerAddressChapter: {
      title: 'Your mailing address',
      pages: {
        preparerAddress: {
          path: 'preparer-address',
          title: 'Your mailing address',
          uiSchema: preparerAddress.uiSchema,
          schema: preparerAddress.schema,
        },
      },
    },
    preparerContactInformationChapter: {
      title: 'Your contact information',
      pages: {
        preparerContactInformation: {
          path: 'preparer-contact-information',
          title: 'Your contact information',
          uiSchema: preparerContactInformation.uiSchema,
          schema: preparerContactInformation.schema,
        },
      },
    },
    claimantIdentificationChapter: {
      title: 'Who you’ll be signing for',
      pages: {
        claimantIdentification: {
          path: 'claimant-identification',
          title: 'Who you’ll be signing for',
          uiSchema: claimantIdentification.uiSchema,
          schema: claimantIdentification.schema,
        },
      },
    },
    claimantPersonalInformationChapter: {
      title: formData => claimantPersonalInformationTitle(formData),
      pages: {
        claimantPersonalInformation: {
          path: 'claimant-personal-information',
          title: formData => claimantPersonalInformationTitle(formData),
          uiSchema: claimantPersonalInformation.uiSchema,
          schema: claimantPersonalInformation.schema,
        },
      },
    },
    claimantSsnChapter: {
      title: formData => claimantSsnTitle(formData),
      pages: {
        claimantSsn: {
          path: 'claimant-identification-information',
          title: formData => claimantSsnTitle(formData),
          uiSchema: claimantSsn.uiSchema,
          schema: claimantSsn.schema,
        },
      },
    },
    claimantAddressChapter: {
      title: formData => claimantAddressTitle(formData),
      pages: {
        claimantAddress: {
          path: 'claimant-address',
          title: formData => claimantAddressTitle(formData),
          uiSchema: claimantAddress.uiSchema,
          schema: claimantAddress.schema,
        },
      },
    },
    claimantContactInformationChapter: {
      title: formData => claimantContactInformationTitle(formData),
      pages: {
        claimantContactInformation: {
          path: 'claimant-contact-information',
          title: formData => claimantContactInformationTitle(formData),
          uiSchema: claimantContactInformation.uiSchema,
          schema: claimantContactInformation.schema,
        },
      },
    },
    preparerQualificationsChapter: {
      title: 'Qualifications',
      pages: {
        preparerQualifications: {
          path: 'preparer-qualifications',
          title: 'Qualifications',
          uiSchema: preparerQualifications.uiSchema,
          schema: preparerQualifications.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
