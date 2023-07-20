import React from 'react';
import footerContent from '@department-of-veterans-affairs/platform-forms/FormFooter';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  claimantAddressTitle,
  claimantContactInformationTitle,
  claimantIsNotVeteran,
  claimantPersonalInformationTitle,
  claimantSsnTitle,
} from './helpers';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from './submit-transformer';

import preparerPersonalInformation from '../pages/preparerPersonalInformation';
import preparerAddress from '../pages/preparerAddress';
import preparerContactInformation from '../pages/preparerContactInformation';
import claimantIdentification from '../pages/claimantIdentification';
import claimantPersonalInformation from '../pages/claimantPersonalInformation';
import claimantSsn from '../pages/claimantSsn';
import claimantAddress from '../pages/claimantAddress';
import claimantContactInformation from '../pages/claimantContactInformation';
import preparerQualifications1 from '../pages/preparerQualifications1';
import preparerQualifications2 from '../pages/preparerQualifications2';
import veteranPersonalInformation from '../pages/veteranPersonalInformation';
import veteranIdentificationInformation1 from '../pages/veteranIdentificationInformation1';
import veteranIdentificationInformation2 from '../pages/veteranIdentificationInformation2';
import additionalInformation from '../pages/additionalInformation';

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
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
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
      fullNamePath: 'preparerFullName',
    },
  },
  formId: '21-0972',
  saveInProgress: {
    messages: {
      inProgress: 'Your alternate signer application (21-0972) is in progress.',
      expired:
        'Your saved alternate signer application (21-0972) has expired. If you want to apply for alternate signer, please start a new application.',
      saved: 'Your alternate signer application has been saved.',
    },
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
          title: 'Claimant personal information',
          // skip if claimant is the veteran
          depends: formData => claimantIsNotVeteran({ formData }),
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
          title: 'Claimant identification information',
          // skip if claimant is the veteran
          depends: formData => claimantIsNotVeteran({ formData }),
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
          title: 'Claimant mailing address',
          // skip if claimant is the veteran
          depends: formData => claimantIsNotVeteran({ formData }),
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
          title: 'Claimant contact information',
          // skip if claimant is the veteran
          depends: formData => claimantIsNotVeteran({ formData }),
          uiSchema: claimantContactInformation.uiSchema,
          schema: claimantContactInformation.schema,
        },
      },
    },
    preparerQualificationsChapter: {
      title: 'Qualifications',
      pages: {
        preparerQualifications1: {
          path: 'preparer-qualifications-1',
          title: 'Qualifications',
          uiSchema: preparerQualifications1.uiSchema,
          schema: preparerQualifications1.schema,
        },
        preparerQualifications2: {
          path: 'preparer-qualifications-2',
          title: 'Qualifications',
          uiSchema: preparerQualifications2.uiSchema,
          schema: preparerQualifications2.schema,
        },
      },
    },
    veteranPersonalInformationChapter: {
      title: 'Veteran’s personal information',
      pages: {
        veteranPersonalInformation: {
          path: 'veteran-personal-information',
          title: 'Veteran’s personal information',
          uiSchema: veteranPersonalInformation.uiSchema,
          schema: veteranPersonalInformation.schema,
        },
      },
    },
    veteranIdentificationInformationChapter: {
      title: 'Veteran’s identification information',
      pages: {
        veteranIdentificationInformation1: {
          path: 'veteran-identification-information-1',
          title: 'Veteran’s identification information',
          uiSchema: veteranIdentificationInformation1.uiSchema,
          schema: veteranIdentificationInformation1.schema,
        },
        veteranIdentificationInformation2: {
          path: 'veteran-identification-information-2',
          title: 'Veteran’s identification information',
          uiSchema: veteranIdentificationInformation2.uiSchema,
          schema: veteranIdentificationInformation2.schema,
        },
      },
    },
    additionalInformationChapter: {
      title: 'Additional information',
      pages: {
        additionalInformation: {
          path: 'additional-information',
          title: 'Additional information',
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
